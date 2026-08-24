import React from "react";

interface ContactClientPageProps {
  id: string;
}
export default function ContactClientPage({ id }: ContactClientPageProps) {
  return <div>{id}</div>;
}
