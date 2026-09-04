import { TRPCError } from "@trpc/server";
import { Blog, Category, Project } from "@my-portfolio/db";
import {
  getCategoriesInputSchema,
  type GetCategoriesInputType,
} from "../schemas/category/getCategories-input.schema";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "../schemas/category/category.schema";
import mongoose from "mongoose";

export async function getCategories(
  input: GetCategoriesInputType,
  userId: string,
) {
  const validatedInput = getCategoriesInputSchema.parse(input);

  try {
    const filter = {
      userId,
      ...(validatedInput.type ? { type: validatedInput.type } : {}),
    };

    const categories = await Category.find(filter).sort({ name: 1 }).lean();

    return categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      type: category.type,
      color: category.color,
    }));
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while fetching categories",
    });
  }
}

export async function createCategory(
  input: CreateCategoryInput,
  userId: string,
) {
  const validInput = createCategorySchema.parse(input);

  if (!mongoose.isValidObjectId(userId)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid user ID",
    });
  }

  try {
    const existing = await Category.findOne({
      userId,
      type: validInput.type,
      slug: validInput.slug,
    }).lean();
    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `A ${validInput.type} category with this slug already exists`,
      });
    }

    await Category.create({ ...validInput, userId });

    return {
      created: true,
    };
  } catch (error: unknown) {
    console.error("Error creating category", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while creating category",
    });
  }
}

export async function updateCategory(
  userId: string,
  input: UpdateCategoryInput,
) {
  const validInput = updateCategorySchema.parse(input);

  if (!mongoose.isValidObjectId(validInput.id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid ID",
    });
  }

  try {
    const { id, ...data } = validInput;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!updatedCategory) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Category Not Found",
      });
    }

    return {
      success: true,
      category: {
        id: updatedCategory._id.toString(),
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        type: updatedCategory.type,
        color: updatedCategory.color,
      },
    };
  } catch (error: unknown) {
    console.error("Error updating categories", error);
    if (error instanceof TRPCError) {
      throw error;
    }

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A category with this slug already exists",
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while updating the category",
    });
  }
}

export async function deleteCategory(id: string, userId: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid category Id",
    });
  }
  try {
    const category = await Category.findOne({ _id: id, userId });
    if (!category) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Category Not Found",
      });
    }

    if (category.type === "blog") {
      const inUse = await Blog.exists({ userId, category: category.slug });
      if (inUse) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "Cannot delete category because it is assigned to active blogs",
        });
      }
    }

    if (category.type === "project") {
      const inUse = await Project.exists({ userId, category: category.slug });
      if (inUse) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "Cannot delete category because it is assigned to active projects",
        });
      }
    }

    await Category.deleteOne({ _id: id, userId });

    return {
      deleted: true,
    };
  } catch (error: unknown) {
    console.error("Error deleting the category", error);
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while deleting the category",
    });
  }
}
