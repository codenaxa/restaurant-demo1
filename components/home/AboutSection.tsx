"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function AboutSection() {
  const variants = useScrollReveal();
  const primaryImageUrl = "/illustrations/about-plate1.webp";
  const secondaryImageUrl = "/illustrations/about-plate2.webp";

  return (
    <section id="story" className="section-shell botanical-bg">
      <div className="section-content grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          className="relative min-h-[560px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={variants}
          custom={0}
        >
          <Image
            src="/illustrations/botanical.svg"
            alt=""
            width={420}
            height={420}
            className="pointer-events-none absolute -left-8 top-4 w-[70%] opacity-35"
          />
          <div className="editorial-card shape-a absolute left-0 top-0 w-[78%] overflow-hidden border-gold/25">
            <img
              src={primaryImageUrl}
              alt="Editorial plated dish illustration"
              className="h-[420px] w-full object-cover object-center brightness-[0.62] contrast-[1.08] saturate-[0.82] sepia-[0.2]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,169,110,0.26),transparent_38%),linear-gradient(180deg,rgba(10,8,5,0.12),rgba(10,8,5,0.56))]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(18,16,12,0)_10%,rgba(18,16,12,0.26)_100%)] mix-blend-multiply" />
          </div>
          <div className="editorial-card shape-b absolute bottom-0 right-0 w-[62%] overflow-hidden border-gold/25">
            <img
              src={secondaryImageUrl}
              alt="Decorative tasting plate illustration"
              className="h-[320px] w-full scale-[0.92] object-cover object-center brightness-[0.55] contrast-[1.06] saturate-[0.72] sepia-[0.24]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(232,201,138,0.16),transparent_34%),linear-gradient(180deg,rgba(10,8,5,0.18),rgba(10,8,5,0.68))]" />
          </div>
          <div className="absolute left-[8%] top-[60%] border border-gold/30 bg-ink px-6 py-4 shadow-gold">
            <p className="text-[0.62rem] uppercase tracking-[0.46em] text-gold">Est. 1994</p>
            <p className="mt-2 font-display text-2xl text-cream">A room of ritual</p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={variants}
          custom={1}
        >
          <p className="section-kicker">The Story</p>
          <h2 className="section-title max-w-xl">
            A dining room staged like a printed feature, intimate and precise.
          </h2>
          <div className="gold-divider" />
          <p className="section-copy">
            Maison Elite treats every service like a chapter. The room is dim, the
            plating is architectural, and the pacing is deliberate enough to make each
            course feel framed rather than merely served.
          </p>
          <p className="section-copy mt-5">
            Gold edging, diagonal silhouettes, and a quietly theatrical brigade bring
            the same refinement to the space that the kitchen brings to fire, pastry,
            and the sea.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
