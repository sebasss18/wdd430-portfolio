"use client";

import { useEffect, useRef } from "react";

const INTRO_MS = 1400;

export default function SoftText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const root = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const words = Array.from(node.querySelectorAll<HTMLElement>("[data-w]"));
    const total = words.length;
    const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((el) => {
        el.style.opacity = "1";
      });
      return;
    }

    const draw = "cubic-bezier(0.65,0,0.35,1)";
    const anims: Animation[] = [];
    let live = false;
    let alive = true;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!live) return;
      const p = clamp(window.scrollY / (window.innerHeight * 0.55));
      words.forEach((el, i) => {
        const l = clamp(p * 1.7 - (i / total) * 0.7);
        el.style.opacity = String(1 - l * 0.85);
        el.style.filter = `blur(${l * 3}px)`;
        el.style.transform = `scale(${1 - l * 0.06})`;
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const base = document.getElementById("intro-root") ? INTRO_MS : 0;

    words.forEach((el, i) => {
      anims.push(
        el.animate(
          [
            { opacity: 0, filter: "blur(4px)", transform: "scale(0.96)" },
            { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
          ],
          { duration: 900, delay: base + i * 25, easing: draw, fill: "both" },
        ),
      );
    });

    Promise.all(anims.map((a) => a.finished))
      .then(() => {
        if (!alive) return;
        words.forEach((el) => {
          el.style.opacity = "1";
          el.style.filter = "blur(0px)";
          el.style.transform = "scale(1)";
        });
        anims.forEach((a) => a.cancel());
        live = true;
        update();
      })
      .catch(() => {});

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      alive = false;
      anims.forEach((a) => a.cancel());
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <p ref={root} aria-label={text} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} aria-hidden="true">
          {i > 0 && " "}
          <span
            data-w
            className="inline-block will-change-transform"
            style={{ opacity: 0 }}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
