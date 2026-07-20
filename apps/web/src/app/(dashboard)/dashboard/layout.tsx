// src/app/(dashboard)/dashboard/layout.tsx
import Sidebar from "@/components/dashboard/side-bar";
import { StatusHeaderPanel } from "@/components/dashboard/status-header-panel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex ">
      {/* Permanent Desktop Sidebar Controller */}
      <Sidebar />

      {/* Primary View Area - Responsive margin pads content clear of the sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64  ">
        {/* Sticky Global Top Bar / Mobile Nav Drawer Container */}
        <StatusHeaderPanel />

        {/* Content Node Element */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
