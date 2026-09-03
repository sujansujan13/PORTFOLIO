import BlogDashboardEditPage from "@/components/dashboard/blog-cms/edit/blog-dashboard-edit-page";
import React from "react";

interface pageParams {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: pageParams) {
  const { id } = await params;
  return <BlogDashboardEditPage blogId={id} />;
}

