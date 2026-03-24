"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#story", label: "Story" },
  { href: "/#reservations", label: "Reserve" },
  { href: "/#contact", label: "Contact" }
];

interface NavbarProps {
  showAdminLink: boolean;
}

export function Navbar({ showAdminLink }: NavbarProps) {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gold/10 bg-[rgba(10,8,5,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
          <Link href="/" className="group">
            <span className="block text-[0.68rem] uppercase tracking-[0.42em] text-gold">
              Maison Elite
            </span>
            <span className="mt-1 block font-display text-2xl leading-none text-cream transition-transform duration-300 group-hover:translate-x-1">
              Editorial Dining
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={pathname === link.href}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
            {showAdminLink ? (
              <Link href="/admin/login" className="nav-link">
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden min-h-[46px] items-center gap-3 border border-gold/20 px-4 text-sm uppercase tracking-[0.24em] text-cream hover:border-gold md:flex"
              aria-label="Open cart"
              onClick={openCart}
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount}
            </button>

            <button
              type="button"
              className="flex min-h-[46px] min-w-[46px] items-center justify-center border border-gold/20 text-cream lg:hidden"
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setIsOpen((current) => !current)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-x-0 top-[78px] z-20 border-b border-gold/10 bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
          >
            <div className="mx-auto flex max-w-7xl flex-col px-5 py-6 sm:px-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block border-b border-gold/10 py-4 font-display text-3xl text-cream",
                      pathname === link.href && "text-gold"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {showAdminLink ? (
                <Link
                  href="/admin/login"
                  className="block py-4 font-display text-3xl text-cream"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
