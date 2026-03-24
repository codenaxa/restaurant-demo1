"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { siteConfig } from "@/lib/site";

interface FooterProps {
  showAdminLink: boolean;
}

export function Footer({ showAdminLink }: FooterProps) {
  const variants = useScrollReveal();

  return (
    <footer className="border-t border-gold/10 bg-ink-2/70 px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={variants}
          custom={0}
        >
          <p className="text-[0.68rem] uppercase tracking-[0.42em] text-gold">Maison Elite</p>
          <h2 className="mt-4 max-w-md font-display text-4xl leading-none text-cream">
            A midnight gold dining room for stories told course by course.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-cream-muted">
            Editorial fine dining, an intimate tasting salon, and a cart flow crafted for
            direct WhatsApp reservations.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={variants}
          custom={1}
        >
          <p className="text-[0.68rem] uppercase tracking-[0.42em] text-gold">Visit</p>
          <p className="mt-4 text-sm leading-7 text-cream-muted">{siteConfig.location}</p>
          <p className="mt-2 text-sm leading-7 text-cream-muted">{siteConfig.reservationPhone}</p>
          <p className="mt-2 text-sm leading-7 text-cream-muted">{siteConfig.contactEmail}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={variants}
          custom={2}
        >
          <p className="text-[0.68rem] uppercase tracking-[0.42em] text-gold">Navigate</p>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/" className="text-sm uppercase tracking-[0.24em] text-cream-muted hover:text-cream">
              Home
            </Link>
            <Link href="/menu" className="text-sm uppercase tracking-[0.24em] text-cream-muted hover:text-cream">
              Menu
            </Link>
            <Link
              href="/#contact"
              className="text-sm uppercase tracking-[0.24em] text-cream-muted hover:text-cream"
            >
              Contact
            </Link>
            {showAdminLink ? (
              <Link
                href="/admin/login"
                className="text-sm uppercase tracking-[0.24em] text-cream-muted hover:text-cream"
              >
                Admin
              </Link>
            ) : null}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
