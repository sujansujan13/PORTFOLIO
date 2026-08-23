// non-null assertion operator:
//
// (statsData.experience.lastUpdated!),
"use client";

import { AnalyticsGridPanel } from "@/components/dashboard/analytics-grid-panel";
import { ProjectListingViewPanel } from "@/components/dashboard/project-listing-view-panel";
import mockData from "@/data/dashboard-mock.json";
import statCardConfig from "@/data/dashboard-stat-cards.json";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboardPage({ user }: { user: any }) {
  // const { openNewProjectModal } = useDashboardStore();
  const dashboardStatQuery = useDashboardStats();

  const { isPending, isError } = dashboardStatQuery;

  if (isPending) {
    return <p>Loading dashboard stats...</p>;
  }

  if (isError) {
    return <p>Could not load dashboard stats.</p>;
  }

  const statsData = dashboardStatQuery.data;

  const overviewStats = statCardConfig.map((card) => {
    if (card.id === "projects") {
      return {
        ...card,
        value: statsData.projects.total,
        changeText: `${statsData.projects.addedThisMonth} added this month`,
      };
    }
    if (card.id === "blogs") {
      return {
        ...card,
        value: statsData.blogs.total,
        changeText: `${statsData.blogs.totalViews} total views`,
      };
    }
    if (card.id === "experience") {
      return {
        ...card,
        value: statsData.experience.total,
        changeText: `Last Updated ${formatDistanceToNow(new Date(statsData.experience.lastUpdated!), { addSuffix: true })} `,
      };
    }
    if (card.id === "messages") {
      return {
        ...card,
        value: statsData.contacts.total,
        changeText:
          statsData.contacts.total > 2 ? "Reuires Action" : "All Caught Up",
      };
    }
    return {
      ...card,
      value: 0,
      changeText: "",
    };
  });

  return (
    <div className="  flex flex-col min-w-0">
      <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
        {/* Welcome Action Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Welcome back,{" "}
              <span className="inline-block uppercase tracking-wide bg-linear-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
                {user?.name}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Here is what's happening with your portfolio today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={"/dashboard/projects/new"}
              // onClick={openNewProjectModal}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2.5 hover:bg-primary/90 transition-all shadow-sm rounded-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> New Project
            </Link>
            <button className="flex items-center gap-1.5 bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2.5 hover:bg-amber-400 transition-all shadow-sm rounded-sm cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> New Blog Post
            </button>
          </div>
        </div>

        {/* Analytics Stats Dashboard Layout Section */}
        <AnalyticsGridPanel statsData={overviewStats} />

        {/* Core Functional Project View Section */}
        <ProjectListingViewPanel projects={mockData.mockProjects} />
      </main>

      {/* Global Footer Layer Segment */}
      <footer className="border-t border-border bg-card/20 px-4 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground font-medium">
          <p>© 2026 Portfolio.IO Admin Dashboard. Built with MERN & Next.js.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              GitHub Repo
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Analytics Guide
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
      {/* Global Form Context Render Trigger Node */}
      {/* <ProjectModal /> */}
    </div>
  );
}

// "use client";
// import { useQuery } from "@tanstack/react-query";

// import { trpc } from "@/utils/trpc";

// export default function Dashboard() {
//   const privateData = useQuery(trpc.privateData.queryOptions());

//   return (
//     <div>
//       <p>API: {privateData.data?.message}</p>
//     </div>
//   );
// }
