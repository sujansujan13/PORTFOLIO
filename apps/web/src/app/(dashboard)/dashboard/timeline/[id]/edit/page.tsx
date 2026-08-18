import EditClientPage from "@/components/dashboard/timeline/edit/edit-client-page";
import React from "react";

interface paramProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: paramProps) {
  const { id } = await params;

  return <EditClientPage id={id} />;
}
