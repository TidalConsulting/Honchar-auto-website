import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Honchar Auto Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const newLeads = await prisma.lead.count({ where: { status: "NEW" } });

  return (
    <div className="min-h-screen bg-ink-50">
      <AdminNav user={user} newLeads={newLeads} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
