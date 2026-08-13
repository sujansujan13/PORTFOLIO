import EditClient from "@/components/dashboard/projects/edit/edit-client-page";
import React from "react";
// import { initialProjects } from "@/data/mockprojects-dashboard";

interface paramProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: paramProps) {
  const { id } = await params;

  // const project = initialProjects.find((p) => p.id === id);

  return (
    <div>
      <EditClient id={id} />
    </div>
  );
}
