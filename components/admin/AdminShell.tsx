"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink">
      <div className="flex min-h-screen">
        <AnimatePresence>
          {sidebarOpen ? (
            <>
              <motion.button
                type="button"
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                aria-label="Close sidebar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                className="fixed inset-y-0 left-0 z-50 w-[292px] max-w-[calc(100vw-1.5rem)]"
                initial={{ x: -32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -32, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <AdminSidebar onNavigate={() => setSidebarOpen(false)} onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-gold/10 bg-[rgba(10,8,5,0.82)] backdrop-blur-xl">
            <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
              <button
                type="button"
                className="inline-flex min-h-[46px] items-center gap-3 border border-gold/20 px-4 text-sm uppercase tracking-[0.24em] text-cream hover:border-gold"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
                Sidebar
              </button>

              <div className="text-right">
                <p className="text-[0.62rem] uppercase tracking-[0.34em] text-gold">Admin Panel</p>
                <p className="mt-1 text-sm text-cream-muted">Menu and service controls</p>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
