"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

const heroWords = ["Where", "Every", "Dish", "Tells", "A", "Story"];

export function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let cleanupScene = () => {};

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".hero-line", { scaleY: 0 }, { scaleY: 1, duration: 0.8 })
        .fromTo(
          ".hero-eyebrow",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.2"
        )
        .fromTo(
          ".hero-word",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.3"
        )
        .fromTo(".hero-scroll", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.2");

      gsap.to(".hero-particle", {
        y: "random(-28, 28)",
        x: "random(-20, 20)",
        duration: "random(4, 8)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.16
      });

      const videoPlane = root.querySelector<HTMLElement>(".hero-video-plane");

      if (!videoPlane) {
        return;
      }

      gsap.set(videoPlane, {
        z: -140,
        scale: 1.14,
        rotationX: 8,
        rotationY: -4,
        transformOrigin: "center center",
        force3D: true
      });
      if (!window.matchMedia("(pointer: fine)").matches) {
        return;
      }

      const handlePointerMove = (event: PointerEvent) => {
        const bounds = root.getBoundingClientRect();
        const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

        gsap.to(videoPlane, {
          x: offsetX * 32,
          y: offsetY * 18,
          rotationY: -4 + offsetX * 10,
          rotationX: 8 - offsetY * 8,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto"
        });

      };

      const resetScene = () => {
        gsap.to(videoPlane, {
          x: 0,
          y: 0,
          rotationY: -4,
          rotationX: 8,
          duration: 1.1,
          ease: "power3.out"
        });
      };

      root.addEventListener("pointermove", handlePointerMove);
      root.addEventListener("pointerleave", resetScene);

      cleanupScene = () => {
        root.removeEventListener("pointermove", handlePointerMove);
        root.removeEventListener("pointerleave", resetScene);
      };
    }, rootRef);

    return () => {
      cleanupScene();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero-frame hero-depth-scene grain-overlay clip-diagonal relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <div className="hero-depth-stage absolute inset-0">
        <div className="hero-video-plane absolute inset-[-6%]">
          <video
            className="hero-video-media"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/illustrations/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hero-overlay-plane absolute inset-0" />
        <div className="hero-glass-frame absolute inset-0" />

        <div className="absolute inset-0">
          <div className="radial-spot absolute left-[8%] top-[14%] h-44 w-44 rounded-full" />
          <div className="radial-spot absolute bottom-[18%] right-[14%] h-52 w-52 rounded-full" />
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="hero-particle absolute h-1.5 w-1.5 rounded-full bg-gold/45"
              style={{
                left: `${8 + ((index * 13) % 78)}%`,
                top: `${12 + ((index * 17) % 66)}%`
              }}
            />
          ))}
        </div>
      </div>

      <div className="section-content relative z-10 flex w-full flex-col px-5 pb-14 pt-28 sm:px-8 lg:px-12 xl:px-16">
        <div className="hero-line mb-8 h-24 w-px origin-top bg-gold" />
        <p className="hero-eyebrow text-[0.68rem] uppercase tracking-[0.44em] text-gold">
          Midnight Gold Service
        </p>
        <h1 className="mt-5 max-w-6xl text-balance font-display text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.88] tracking-tight text-cream">
          {heroWords.map((word) => (
            <span
              key={word}
              className={`hero-word mr-[0.2em] inline-block ${word === "Dish" ? "italic text-gold" : ""}`}
            >
              {word}
            </span>
          ))}
        </h1>
        <p className="hero-sub mt-7 max-w-2xl text-base leading-8 text-cream-muted sm:text-lg">
          A luxury tasting room shaped like an editorial spread, where textures, smoke,
          and candlelit service leave as much of an impression as the menu.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/menu" className="gold-button hero-cta">
            Explore Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/#reservations" className="ghost-button hero-cta">
            Reserve Table
          </Link>
        </div>
        <div className="hero-scroll mt-14 flex items-center gap-4">
          <span className="text-[0.68rem] uppercase tracking-[0.44em] text-cream-muted">
            Scroll
          </span>
          <span className="flex h-12 w-6 items-start justify-center rounded-full border border-gold/20 p-1">
            <span className="h-3 w-1 rounded-full bg-gold animate-scroll-pulse" />
          </span>
        </div>
      </div>
    </section>
  );
}
