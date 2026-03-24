"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, ShieldCheck, UtensilsCrossed, X } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu Manager", icon: UtensilsCrossed }
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  onClose?: () => void;
}

export function AdminSidebar({ onNavigate, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-gold/10 bg-ink-2/95 px-5 py-8 shadow-[24px_0_60px_rgba(0,0,0,0.45)]">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.42em] text-gold">Maison Elite</p>
          <h2 className="mt-4 font-display text-4xl leading-none text-cream">Admin Atelier</h2>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center border border-gold/15 text-cream-muted hover:border-gold/30 hover:text-cream"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex min-h-[52px] items-center gap-3 border px-4 text-sm uppercase tracking-[0.28em] transition-colors",
                isActive
                  ? "border-gold/30 bg-gold/10 text-cream"
                  : "border-gold/10 text-cream-muted hover:border-gold/20 hover:text-cream"
              )}
              onClick={onNavigate}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 border border-gold/10 bg-ink px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
            <ShieldCheck className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.34em] text-gold">Secure Access</p>
            <p className="mt-1 text-sm text-cream-muted">Private service controls</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-auto flex min-h-[52px] w-full items-center justify-center gap-3 border border-gold/10 text-sm uppercase tracking-[0.28em] text-cream-muted hover:border-gold/30 hover:text-cream"
        onClick={() => void signOut({ callbackUrl: "/admin/login" })}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </aside>
  );
}
