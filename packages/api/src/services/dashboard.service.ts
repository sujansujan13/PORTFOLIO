// Understand all the things
//
//   const currentMonth = new Date();
// currentMonth.setDate(1);
//
// $gte: currentMonth
//
// aggregate, what is this
//
// {
//   $group: {
//     _id: null,
//     views: { $sum: "$views" },
//   },
// },

// only send latestTimeline and got error
//  lastUpdated: latestTimeline?.updatedAt,
//
// Promise.all
import { Project, Blog, Timeline, Contact } from "@my-portfolio/db";
import { dashboardStatSchema } from "../schemas/dashboard.schema";

export async function getDashboardStats(userId:string) {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  const [
    totalProjects,
    projectThisMonth,
    latestTimeline,
    totalBlogs,
    totalBlogViews,
    totalContactMessages,
  ] = await Promise.all([
    Project.countDocuments({userId}),
    Project.countDocuments({
      userId,
      createdAt: { $gte: currentMonth },
    }),
    Timeline.findOne({userId}).sort({
      updatedAt: -1,
    }),
    Blog.countDocuments({userId}),
    Blog.aggregate([{$match:{
      userId
    }},
      {
        $group: {
          _id: null,
          views: { $sum: "$views" },
        },
      },
    ]),
    Contact.countDocuments({
      $or: [
        { recipientUserId: userId },
        { recipientUserId: null },
        { recipientUserId: "" },
        { recipientUserId: { $exists: false } },
      ],
      status: "unread",
    }),
  ]);
  return dashboardStatSchema.parse({
    projects: {
      total: totalProjects,
      addedThisMonth: projectThisMonth,
    },
    experience: {
      total: await Timeline.countDocuments({ userId, type: "experience" }),
      lastUpdated: latestTimeline?.updatedAt ?? null,
    },
    blogs: {
      total: totalBlogs,
      totalViews: totalBlogViews[0]?.views ?? 0,
    },
    contacts: {
      total: totalContactMessages,
    },
  });
}

// Option 1: MongoDB Aggregation (Best if you need multiple statistics)
// const [stats] = await Project.aggregate([
//   {
//     $group: {
//       _id: null,
//       totalProjects: { $sum: 1 },
//       projectsThisMonth: {
//         $sum: {
//           $cond: [{ $gte: ["$createdAt", currentMonth] }, 1, 0],
//         },
//       },
//     },
//   },
// ]);

// console.log(stats);
// Output
// {
//   totalProjects: 24,
//   projectsThisMonth: 2
// }

// Option 2: $facet (Recommended for dashboards)
//
// If you're collecting several different statistics, $facet is very clean:
// const [stats] = await Project.aggregate([
//   {
//     $facet: {
//       totalProjects: [{ $count: "count" }],
//       projectsThisMonth: [
//         {
//           $match: {
//             createdAt: { $gte: currentMonth },
//           },
//         },
//         { $count: "count" },
//       ],
//     },
//   },
// ]);

// const result = {
//   totalProjects: stats.totalProjects[0]?.count ?? 0,
//   projectsThisMonth: stats.projectsThisMonth[0]?.count ?? 0,
// };
