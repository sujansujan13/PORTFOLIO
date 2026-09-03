import type {
  PublicTimelineItem,
  PublicTimelineResponse,
  TimelineType,
} from "../schemas/timeline.schema";
import { Timeline, User } from "@my-portfolio/db";
import {
  createTimelineSchema,
  type CreateTimelineInput,
} from "../schemas/timeline/createTimeline.schema";
import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";
import {
  updateTimelineSchema,
  type UpdateTimelineInput,
} from "../schemas/timeline/updateTimeline.schema";


function serializeTimelineItem(item: any): PublicTimelineItem {
  return {
    id: String(item._id),
    role: item.role,
    company: item.company,
    location: item.location,
    startDate: item.startDate,
    endDate: item.endDate,
    isPresent: item.isPresent,
    description: item.description,
    bullets: item.bullets ?? [],
    tags: item.tags ?? [],
    type: item.type,
    order: item.order ?? 0,
  };
}

function serializeDashboardTimelineItem(item: any) {
  return {
    id: String(item._id),
    role: item.role,
    company: item.company,
    location: item.location,
    startDate: item.startDate,
    endDate: item.endDate,
    isPresent: item.isPresent,
    description: item.description,
    bullets: item.bullets ?? [],
    tags: item.tags ?? [],
    type: item.type,
    order: item.order ?? 1,
    publicAccess: item.publicAccess,
    version: item.version,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function getPublicTimeline(input?: {
  type?: TimelineType;
  limit?: number;
  userId?: string;
}): Promise<PublicTimelineResponse> {
  const filter: Record<string, unknown> = { publicAccess: true };

  if (input?.userId?.trim()) {
    filter.userId = input.userId.trim();
  } else {
    const defaultUser = await User.findOne().sort({ createdAt: 1 }).lean();
    if (defaultUser?._id) {
      filter.userId = String(defaultUser._id);
    }
  }

  if (input?.type) {
    filter.type = input.type;
  }

  const timelineItems = await Timeline.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .limit(input?.limit ?? 10)
    .lean();

  const items = timelineItems.map(serializeTimelineItem);

  // return {
  //   education: items.filter((item) => item.type === "education"),
  //   experience: items.filter((item) => item.type === "experience"),
  // };

  return items.reduce<PublicTimelineResponse>(
    (acc, item) => {
      // acc.education.push(item);
      acc[item.type].push(item);
      return acc;
    },
    {
      education: [],
      experience: [],
    },
  );
}

// Timeline.aggregate([
//   { $match: { publicAccess: true } },
//   {
//     $group: {
//       _id: "$type",
//       items: { $push: "$$ROOT" },
//     },
//   },
// ]);

export type timelineType = "all" | "education" | "experience";

type getDashboardTimelineProps = {
  search?: string;
  type: timelineType;
};

export async function getDashboardTimeline(
  userId: string,
  { search = "", type = "all" }: getDashboardTimelineProps,
) {
  const filter: Record<string, unknown> = { userId };

  if (type !== "all") {
    filter.type = type;
  }

  if (search.trim()) {
    // he "i" is a flag meaning case-insensitive.
    // RegExp is JavaScript's regular expression object. It lets you define a pattern for matching text.
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedSearch, "i");

    filter.$or = [
      { role: searchRegex },
      { company: searchRegex },
      { location: searchRegex },
      { tags: searchRegex },
      { description: searchRegex },
    ];
  }

  const items = await Timeline.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .lean();

  const serializedItems = items.map(serializeDashboardTimelineItem);

  // for counts
  const [all, education, experience] = await Promise.all([
    Timeline.countDocuments({ userId }),
    Timeline.countDocuments({ userId, type: "education" }),
    Timeline.countDocuments({ userId, type: "experience" }),
  ]);

  return {
    items: serializedItems,
    counts: {
      all,
      education,
      experience,
    },
  };
}

export async function createTimeline(
  userId: string,
  input: CreateTimelineInput,
) {
  const validatedData = createTimelineSchema.parse(input);

  // Retry up to 3 times in case another request creates
  // a timeline item with the same order at the same time.
  for (let attempt = 0; attempt < 3; attempt++) {
    const lastTimelineItem = await Timeline.findOne({
      userId,
      type: validatedData.type,
    })
      .sort({ order: -1 })
      .select("order")
      .lean();

    const nextOrder = (lastTimelineItem?.order ?? 0) + 1;

    try {
      const timeline = await Timeline.create({
        ...validatedData,
        userId,
        order: nextOrder,
        version: 0,
      });
      return serializeDashboardTimelineItem(timeline);
    } catch (error: any) {
      // The unique index prevents two requests from using
      // the same type + order combination.
      if (error?.code !== 11000) {
        throw error;
      }

      // Another request took this order.
      // Retry and calculate the next order again.
    }
  }

  throw new TRPCError({
    code: "CONFLICT",
    message: "Unable to create timeline entry due to concurrent updates.",
  });
}

export async function getDashboardTimelineById(userId: string, id: string) {
  // Validate that the provided ID is a valid MongoDB ObjectId.
  if (!mongoose.isValidObjectId(id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid timeline ID.",
    });
  }

  const timeline = await Timeline.findOne({ _id: id, userId }).lean();

  if (!timeline) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Timeline with ID: ${id} doesn't exist`,
    });
  }

  return serializeDashboardTimelineItem(timeline);
}

export async function updateTimeline(
  userId: string,
  id: string,
  input: UpdateTimelineInput,
) {
  // Validate the timeline ID before querying MongoDB.
  if (!mongoose.isValidObjectId(id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Timeline ID.",
    });
  }

  // Validate the update data.
  const validatedInput = updateTimelineSchema.parse(input);

  const { version, ...updateData } = validatedInput;

  // service codes
  /*
   * Only update the document if its current version
   * is the same version the client originally received.
   *
   * This prevents one user's stale data from overwriting
   * another user's newer changes.
   */
  const timeline = await Timeline.findOneAndUpdate(
    {
      userId,
      _id: id,
      version,
    },
    {
      $set: updateData,
      $inc: {
        version: 1,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  /*
   * If nothing was returned, there are two possibilities:
   *
   * 1. The timeline item doesn't exist.
   * 2. Someone else updated it and its version changed.
   *
   * Check which one it is so we can return the correct error.
   */
  if (!timeline) {
    const existingTimeline = await Timeline.exists({
      _id: id,
      userId,
    });

    if (!existingTimeline) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Timeline data with ID ${id} was not found.`,
      });
    }

    throw new TRPCError({
      code: "CONFLICT",
      message:
        "This timeline item was modified by another user. Please refresh and try again.",
    });
  }

  return {
    timeline: serializeTimelineItem(timeline),
    updated: true,
  };
}

export async function deleteTimeline(userId: string, id: string) {
  // Validate the timeline ID before querying MongoDB.
  if (!mongoose.isValidObjectId(id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Timeline ID.",
    });
  }

  const session = await mongoose.startSession();

  try {
    let deletedTimelineId: string | null = null;

    await session.withTransaction(async () => {
      // Find the item that is going to be deleted.
      const timeline = await Timeline.findOne({ _id: id, userId })
        .select("_id type order")
        .session(session)
        .lean();

      if (!timeline) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Timeline with ID: ${id} not found.`,
        });
      }

      const deletedOrder = timeline.order;
      const timelineType = timeline.type;

      // Find the current highest order.
      const lastTimelineItem = await Timeline.findOne({
        userId,
        type: timelineType,
      })
        .sort({ order: -1 })
        .select("order")
        .session(session)
        .lean();

      const maxOrder = lastTimelineItem?.order ?? deletedOrder;

      /*
       * Move affected items into a temporary order range.
       *
       * Example:
       *
       * 1 → Google
       * 2 → Microsoft  ← deleting
       * 3 → Amazon
       * 4 → Meta
       *
       * Temporary:
       *
       * 1 → Google
       * 2 → deleting
       * 1003 → Amazon
       * 1004 → Meta
       *
       * This avoids conflicts with the unique
       * { type, order } index while shifting orders.
       */
      const temporaryOffset = maxOrder + 1;

      await Timeline.updateMany(
        {
          userId,
          type: timelineType,
          order: { $gt: deletedOrder },
        },
        {
          $inc: {
            order: temporaryOffset,
          },
        },
        { session },
      );

      // Delete the requested timeline item.
      await Timeline.deleteOne(
        {
          userId,
          _id: id,
        },
        { session },
      );

      /*
       * Move the temporarily shifted items back down by
       * temporaryOffset + 1.
       *
       * Example:
       *
       * 1003 → 2
       * 1004 → 3
       */
      await Timeline.updateMany(
        {
          userId,
          type: timelineType,
          order: {
            $gt: temporaryOffset + deletedOrder,
          },
        },
        {
          $inc: {
            order: -(temporaryOffset + 1),
          },
        },
        { session },
      );

      deletedTimelineId = String(timeline._id);
    });

    return {
      id: deletedTimelineId,
      deleted: true,
    };
  } finally {
    await session.endSession();
  }
}

export async function deleteMultipleTimeline(userId: string, ids: string[]) {
  // 1. Validate that at least one ID was provided.
  if (ids.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "At least one timeline ID is required.",
    });
  }

  // 2. Validate every ID before touching the database.
  const invalidId = ids.find((id) => !mongoose.isValidObjectId(id));

  if (invalidId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid timeline ID: ${invalidId}`,
    });
  }

  // 3. Remove duplicate IDs.
  const uniqueIds = [...new Set(ids)];

  const session = await mongoose.startSession();

  try {
    let deletedCount = 0;

    await session.withTransaction(async () => {
      // 4. Find all requested timeline items.
      const timelines = await Timeline.find({
        userId,
        _id: { $in: uniqueIds },
      })
        .select("_id type")
        .session(session)
        .lean();

      // 5. Make sure every requested ID exists.
      if (timelines.length !== uniqueIds.length) {
        const foundIds = new Set(timelines.map((item) => String(item._id)));

        const missingIds = uniqueIds.filter((id) => !foundIds.has(id));

        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Some timeline items were not found: ${missingIds.join(", ")}`,
        });
      }

      // 6. Delete all selected timeline items.
      const deleteResult = await Timeline.deleteMany(
        {
          userId,
          _id: { $in: uniqueIds },
        },
        { session },
      );

      deletedCount = deleteResult.deletedCount;

      // 7. Get the types affected by this deletion.
      const affectedTypes = [...new Set(timelines.map((item) => item.type))];

      /*
       * 8. Recalculate order for every remaining item
       *    belonging to an affected type.
       *
       * We fetch them in their current order and assign:
       *
       * first item  → 1
       * second item → 2
       * third item  → 3
       * ...
       */
      for (const type of affectedTypes) {
        const remainingItems = await Timeline.find({
          userId,
          type,
        })
          .sort({ order: 1, createdAt: 1 })
          .select("_id")
          .session(session)
          .lean();

        // 9. Temporarily move orders away from the normal range.
        const temporaryOffset = 1_000_000;

        await Timeline.updateMany(
          {
            userId,
            type,
          },
          {
            $inc: {
              order: temporaryOffset,
            },
          },
          { session },
        );

        // 10. Assign clean consecutive orders.
        const bulkOperations = remainingItems.map((item, index) => ({
          updateOne: {
            filter: {
              _id: item._id,
              userId,
            },
            update: {
              $set: {
                order: index + 1 + temporaryOffset,
              },
            },
          },
        }));

        if (bulkOperations.length > 0) {
          await Timeline.bulkWrite(bulkOperations, { session });
        }

        // 11. Remove the temporary offset.
        await Timeline.updateMany(
          {
            userId,
            type,
            order: {
              $gte: temporaryOffset + 1,
            },
          },
          {
            $inc: {
              order: -temporaryOffset,
            },
          },
          { session },
        );
      }
    });

    return {
      deleted: true,
      deletedCount,
      ids: uniqueIds,
    };
  } finally {
    await session.endSession();
  }
}
