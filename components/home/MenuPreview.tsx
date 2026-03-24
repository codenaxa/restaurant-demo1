"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { MenuCard } from "@/components/menu/MenuCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { MenuItemRecord } from "@/lib/types";

interface MenuPreviewProps {
  items: MenuItemRecord[];
}

export function MenuPreview({ items }: MenuPreviewProps) {
  const variants = useScrollReveal();

  return (
    <section className="section-shell clip-diagonal-r isolate bg-ink-2/60 lg:pb-28">
      <div className="section-content">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={variants}
          custom={0}
        >
          <p className="section-kicker">Featured Plates</p>
          <h2 className="section-title">
            Three signatures arranged in a single editorial row.
          </h2>
          <div className="gold-divider" />
          <p className="section-copy">
            Seasonal highlights, tasting room signatures, and after-hours pours selected
            to turn first impressions into an order.
          </p>
        </motion.div>

        <div className="relative z-0 mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.id}
              className="relative z-0"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <MenuCard item={item} index={index} variant="preview" />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={variants}
          custom={1}
        >
          <Link href="/menu" className="gold-button">
            View All Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
