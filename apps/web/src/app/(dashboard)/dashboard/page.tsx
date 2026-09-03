import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import AdminDashboardPage from "./dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {

  let session = null;

  try {
    const res = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });
    session = res?.data;
  } catch (error) {
    console.error("Failed to fetch auth session:", error);
  }

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <AdminDashboardPage user={session.user} />
    </div>
  );
}

