"use client";

import { motion } from "framer-motion";
import { Clock3, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { siteConfig } from "@/lib/site";

function buildPhoneHref(value: string) {
  const sanitized = value.replace(/[^\d+]/g, "");
  return `tel:${sanitized}`;
}

export function ContactSection() {
  const variants = useScrollReveal();

  return (
    <section id="contact" className="section-shell botanical-bg">
      <div className="section-content grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={variants}
          custom={0}
        >
          <p className="section-kicker">Contact</p>
          <h2 className="section-title max-w-xl">
            Every direct line to the restaurant, staged in one place.
          </h2>
          <div className="gold-divider" />
          <p className="section-copy">
            Phone, email, location, WhatsApp, and opening hours all pull from your
            environment configuration so the home page stays editable without code changes.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          <motion.a
            href={buildPhoneHref(siteConfig.reservationPhone)}
            className="editorial-card shape-a p-6 hover:border-gold/35"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            custom={1}
          >
            <PhoneCall className="h-5 w-5 text-gold" />
            <p className="mt-5 text-[0.62rem] uppercase tracking-[0.34em] text-gold">Phone</p>
            <p className="mt-3 text-lg leading-7 text-cream">{siteConfig.reservationPhone}</p>
          </motion.a>

          <motion.a
            href={`mailto:${siteConfig.contactEmail}`}
            className="editorial-card shape-b p-6 hover:border-gold/35"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            custom={2}
          >
            <Mail className="h-5 w-5 text-gold" />
            <p className="mt-5 text-[0.62rem] uppercase tracking-[0.34em] text-gold">Email</p>
            <p className="mt-3 text-lg leading-7 text-cream">{siteConfig.contactEmail}</p>
          </motion.a>

          <motion.a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            className="editorial-card shape-c p-6 hover:border-gold/35"
            target="_blank"
            rel="noreferrer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            custom={3}
          >
            <MessageCircle className="h-5 w-5 text-gold" />
            <p className="mt-5 text-[0.62rem] uppercase tracking-[0.34em] text-gold">
              WhatsApp
            </p>
            <p className="mt-3 text-lg leading-7 text-cream">{siteConfig.reservationPhone}</p>
          </motion.a>

          <motion.div
            className="editorial-card shape-a p-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            custom={4}
          >
            <MapPin className="h-5 w-5 text-gold" />
            <p className="mt-5 text-[0.62rem] uppercase tracking-[0.34em] text-gold">Visit</p>
            <p className="mt-3 text-lg leading-7 text-cream">{siteConfig.location}</p>
          </motion.div>

          <motion.div
            className="editorial-card shape-b p-6 md:col-span-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            custom={5}
          >
            <Clock3 className="h-5 w-5 text-gold" />
            <p className="mt-5 text-[0.62rem] uppercase tracking-[0.34em] text-gold">Hours</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {siteConfig.hours.map((hoursLine, index) => (
                <motion.div
                  key={hoursLine}
                  className="border border-gold/12 bg-ink-3/60 px-4 py-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={variants}
                  custom={index}
                >
                  <p className="text-sm leading-7 text-cream">{hoursLine}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
