"use client";

// Presenta tecnologías como burbujas que se expanden en una tarjeta animada.
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import Reveal from "@/components/effects/Reveal";

const info: Record<string, string> = {
  "Next.js": "React framework for building fast, full-stack web apps.",
  React: "UI library for building interfaces out of components.",
  TypeScript: "JavaScript with static types for safer, cleaner code.",
  "Tailwind CSS": "Utility-first CSS framework for styling quickly.",
  "Node.js": "JavaScript runtime that lets you run code on the server.",
  Express: "Minimal web framework for building APIs on Node.",
  MongoDB: "NoSQL database that stores data as JSON-like documents.",
  Prisma: "Type-safe ORM for working with databases.",
  Render: "Cloud platform to deploy web apps and APIs.",
  Git: "Version control system to track changes in code.",
};

const ease = [0.32, 0.72, 0, 1] as const;
const CARD_H = 160;

const springXY = {
  type: "spring",
  stiffness: 380,
  damping: 35,
  mass: 0.9,
} as const;
const springW = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.9,
} as const;
const springH = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.9,
} as const;

type Box = { x: number; y: number; width: number; height: number };

type Active = {
  name: string;
  el: HTMLElement;
  box: Box;
  target: number;
};

const measure = (el: HTMLElement): Box => {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - window.innerWidth / 2,
    y: r.top + r.height / 2 - window.innerHeight / 2,
    width: r.width,
    height: r.height,
  };
};

export default function StackBubbles({ stack }: { stack: string[] }) {
  const [active, setActive] = useState<Active | null>(null);
  const [hidden, setHidden] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const open = (name: string, el: HTMLElement) => {
    setHidden(name);
    setExpanded(true);
    setActive({
      name,
      el,
      box: measure(el),
      target: Math.min(320, window.innerWidth - 48),
    });
  };

  const close = useCallback(() => {
    if (!active || !expanded) return;
    setActive({ ...active, box: measure(active.el) });
    setExpanded(false);
  }, [active, expanded]);

  const finish = () => {
    if (expanded) return;
    setActive(null);
    setHidden(null);
  };

  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [active, close, expanded]);

  return (
    <>
      <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8">
        {stack.map((tech, i) => (
          <Reveal key={tech} retraso={i * 60}>
            <button
              type="button"
              onClick={(e) => open(tech, e.currentTarget)}
              className={`block cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-[transform,background-color,border-color,color] duration-300 hover:scale-105 hover:border-slate-800 hover:bg-slate-800 hover:text-white active:scale-95 sm:px-4 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900 ${
                hidden === tech ? "invisible" : "visible"
              }`}
            >
              {tech}
            </button>
          </Reveal>
        ))}
      </div>

      {active && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={close}
            className="fixed inset-0 z-50 touch-none bg-slate-900/25 dark:bg-black/50"
          />

          <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
            <motion.div
              initial={active.box}
              animate={
                expanded
                  ? { x: 0, y: 0, width: active.target, height: CARD_H }
                  : active.box
              }
              transition={
                expanded
                  ? {
                      x: springXY,
                      y: springXY,
                      width: springW,
                      height: springH,
                    }
                  : { duration: 0.38, ease }
              }
              onAnimationComplete={finish}
              style={{ borderRadius: 28 }}
              onClick={close}
              className="pointer-events-auto relative shrink-0 overflow-hidden bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)] dark:bg-slate-900 dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
            >
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 1 }}
                animate={{ opacity: expanded ? 0 : 1 }}
                transition={{
                  duration: expanded ? 0.15 : 0.14,
                  delay: expanded ? 0 : 0.2,
                }}
                className="pointer-events-none absolute inset-0 rounded-[28px] border border-slate-300 dark:border-slate-700"
              />
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: expanded ? 0 : 1 }}
                transition={{ duration: 0.14, delay: expanded ? 0 : 0.2 }}
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {active.name}
              </motion.span>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{
                  duration: expanded ? 0.28 : 0.08,
                  delay: expanded ? 0.18 : 0,
                }}
                style={{ width: active.target }}
                className="absolute left-1/2 top-0 flex h-full -translate-x-1/2 flex-col items-center justify-center px-6 text-center"
              >
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {active.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {info[active.name]}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}
