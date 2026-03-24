"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;

    if (!ring || !dot) {
      return;
    }

    let frameId = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let isVisible = false;

    const render = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
      dot.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;

      frameId = window.requestAnimationFrame(render);
    };

    const showCursor = () => {
      if (!isVisible) {
        document.body.classList.add("custom-cursor-active");
        isVisible = true;
      }

      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    const hideCursor = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
      document.body.classList.remove("custom-cursor-active");
      isVisible = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      showCursor();
    };

    const handlePointerOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        hideCursor();
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", showCursor);
    window.addEventListener("blur", hideCursor);
    document.addEventListener("mouseout", handlePointerOut);

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", showCursor);
      window.removeEventListener("blur", hideCursor);
      document.removeEventListener("mouseout", handlePointerOut);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] h-9 w-9 rounded-full border border-gold/55 opacity-0 transition-opacity duration-200"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[121] h-1.5 w-1.5 rounded-full bg-gold opacity-0 transition-opacity duration-150"
      />
    </>
  );
}
