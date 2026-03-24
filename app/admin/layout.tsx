import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    return <div className="min-h-screen bg-ink px-5 py-8 sm:px-8">{children}</div>;
  }

  return (
    <AdminShell>{children}</AdminShell>
  );
}
