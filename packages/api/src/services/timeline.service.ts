import { unknown } from "better-auth";
import type {
  PublicTimelineItem,
  PublicTimelineResponse,
  TimelineType,
} from "../schemas/timeline.schema";
import { Timeline } from "@my-portfolio/db";
function serializeTimelineItem(item: any): PublicTimelineItem {
  return {
    id: String(item._id),
    role: item.role,
    company: item.company,
    location: item.location,
    period: item.period,
    description: item.description,
    bullets: item.bullets ?? [],
    tags: item.tags ?? [],
    type: item.type,
    order: item.order ?? 0,
  };
}

export async function getPublicTimeline(input?: {
  type?: TimelineType;
  limit?: number;
}): Promise<PublicTimelineResponse> {
  const filter: Record<string, unknown> = { publicAccess: true };

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
