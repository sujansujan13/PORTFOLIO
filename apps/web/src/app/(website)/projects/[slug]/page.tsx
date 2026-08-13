import DynamicProjectClient from "@/components/projects/dynamic-project-client";
import React from "react";

interface paramProps {
  params: Promise<{ slug: string }>;
}

export default async function page({ params }: paramProps) {
  const { slug } = await params;

  return <DynamicProjectClient slug={slug} />;
}
