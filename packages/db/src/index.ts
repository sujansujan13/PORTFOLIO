import { env } from "@my-portfolio/env/server";
import mongoose from "mongoose";

await mongoose.connect(env.DATABASE_URL).catch((error) => {
  console.log("Error connecting to database:", error);
});

// Sometimes Mongoose doesn't support a feature conveniently, or you want direct access to MongoDB.
// These use the MongoDB driver's API directly.
const client = mongoose.connection.getClient().db("myDB");

export { client };

// This is just a re-export.
// Instead of importing as import { Project } from "@my-portfolio/db/models/project.model";
// we can directly import { Project } from "@my-portfolio/db";
export { Project } from "./models/project.model";

export { Blog } from "./models/blog.model";

export { Timeline } from "./models/timeline.model";
