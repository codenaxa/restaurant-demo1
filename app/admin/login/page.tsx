import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { auth, isAdminAuthConfigured } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await auth();
  const isConfigured = await isAdminAuthConfigured();

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,169,110,0.18),transparent_30%),linear-gradient(180deg,rgba(10,8,5,0.84),rgba(10,8,5,1))]" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-kicker">Private Dashboard</p>
          <h1 className="section-title">Operational controls in the same midnight gold language.</h1>
        </div>
        <AdminLoginForm isConfigured={isConfigured} />
      </div>
    </div>
  );
}
