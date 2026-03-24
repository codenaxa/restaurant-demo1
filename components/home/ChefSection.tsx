"use client";

import { motion } from "framer-motion";

import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ChefSectionProps {
  imageUrl?: string;
}

export function ChefSection({ imageUrl }: ChefSectionProps) {
  const variants = useScrollReveal();
  const resolvedImageUrl = imageUrl || "/illustrations/chef-portrait.webp";

  return (
    <section className="section-shell bg-ink">
      <div className="section-content grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={variants}
          custom={0}
        >
          <div className="mb-6 h-px w-20 bg-gold" />
          <blockquote className="font-display text-4xl italic leading-tight text-cream sm:text-5xl">
            "Luxury is not excess. Luxury is restraint sharp enough that every detail
            becomes unforgettable."
          </blockquote>
          <p className="mt-8 text-[0.68rem] uppercase tracking-[0.42em] text-gold">
            Chef Adrien Vale
          </p>
          <p className="mt-4 max-w-xl text-base leading-8 text-cream-muted">
            The kitchen leans on smoke, texture, and a plated sense of narrative. Each
            menu change begins with the visual composition of the course and ends with
            a flavor memory designed to linger.
          </p>
        </motion.div>

        <motion.div
          className="clip-parallelogram editorial-card mx-auto max-w-[520px] overflow-hidden border-gold/25"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={variants}
          custom={1}
        >
          <>
            <img
              src={resolvedImageUrl}
              alt="Editorial chef portrait"
              className="h-[520px] w-full object-cover object-center brightness-[0.62] contrast-[1.1] saturate-[0.84] sepia-[0.18]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,169,110,0.22),transparent_26%),linear-gradient(180deg,rgba(10,8,5,0.08),rgba(10,8,5,0.54))]" />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,rgba(10,8,5,0.52),transparent)]" />
          </>
        </motion.div>
      </div>
    </section>
  );
}
