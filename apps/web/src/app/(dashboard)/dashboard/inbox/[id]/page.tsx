import ContactClientPage from "@/components/dashboard/inbox/dynamicPage/contact-client-page";
import React from "react";

interface paramsProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: paramsProps) {
  const { id } = await params;
  return <ContactClientPage id={id} />;
}
