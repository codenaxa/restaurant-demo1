import { redirect } from "next/navigation";

import { AdminMenuManager } from "@/components/admin/AdminMenuManager";
import { PageTransition } from "@/components/shared/PageTransition";
import { auth } from "@/lib/auth";

export default async function AdminMenuPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <PageTransition>
      <div className="mb-8">
        <p className="section-kicker">Menu Manager</p>
        <h1 className="section-title">Publish, reorder, and retire plates</h1>
        <div className="gold-divider" />
        <p className="section-copy">
          The left panel handles composition and validation. The right panel controls
          visibility, featured placement, and service order.
        </p>
      </div>

      <AdminMenuManager />
    </PageTransition>
  );
}
