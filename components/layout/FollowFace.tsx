"use client";

import { useEffect, useRef, useState } from "react";

type Expression =
  | "neutral"
  | "shaking"
  | "yawn"
  | "wink"
  | "smile"
  | "mad"
  | "sleepy"
  | "surprised"
  | "asleep"
  | "curious";

type Shape = {
  eyeW: number;
  eyeH: number;
  mouthW: number;
  mouthH: number;
  mouthR: number;
  eyeCut?: number;
};

type FollowFaceProps = {
  size?: number;
  color?: string;
  background?: string;
  className?: string;
  menuOpen?: boolean;
  menuSelector?: string;
  tilt?: boolean;
};

type PermissionEvent = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type Controls = {
  press: () => void;
  menuChanged: (open: boolean) => void;
};

const shapes: Record<Expression, Shape> = {
  neutral: { eyeW: 0.17, eyeH: 0.3, mouthW: 0.34, mouthH: 0.055, mouthR: 0.02 },
  shaking: { eyeW: 0.17, eyeH: 0.36, mouthW: 0.2, mouthH: 0.13, mouthR: 0.045 },
  yawn: { eyeW: 0.17, eyeH: 0.06, mouthW: 0.2, mouthH: 0.2, mouthR: 0.08 },
  wink: { eyeW: 0.17, eyeH: 0.3, mouthW: 0.36, mouthH: 0.06, mouthR: 0.025 },
  smile: { eyeW: 0.17, eyeH: 0.22, mouthW: 0.44, mouthH: 0.07, mouthR: 0.03 },
  mad: {
    eyeW: 0.18,
    eyeH: 0.26,
    mouthW: 0.3,
    mouthH: 0.04,
    mouthR: 0.02,
    eyeCut: 45,
  },
  sleepy: { eyeW: 0.17, eyeH: 0.12, mouthW: 0.28, mouthH: 0.045, mouthR: 0.02 },
  surprised: {
    eyeW: 0.16,
    eyeH: 0.4,
    mouthW: 0.12,
    mouthH: 0.12,
    mouthR: 0.04,
  },
  asleep: {
    eyeW: 0.17,
    eyeH: 0.035,
    mouthW: 0.26,
    mouthH: 0.045,
    mouthR: 0.02,
  },
  curious: {
    eyeW: 0.18,
    eyeH: 0.36,
    mouthW: 0.16,
    mouthH: 0.05,
    mouthR: 0.025,
  },
};

const idleActions: { expression: Expression; ms: number }[] = [
  { expression: "yawn", ms: 1600 },
  { expression: "wink", ms: 700 },
  { expression: "smile", ms: 1400 },
  { expression: "sleepy", ms: 1800 },
  { expression: "surprised", ms: 800 },
  { expression: "curious", ms: 1600 },
];

const clamp = (value: number, min = -1, max = 1) =>
  Math.min(max, Math.max(min, value));

export default function FollowFace({
  size = 220,
  color = "#0f172a",
  background = "transparent",
  className,
  menuOpen: menuOpenProp,
  menuSelector = "[data-face-sleep]",
  tilt = false,
}: FollowFaceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<Controls | null>(null);
  const [observed, setObserved] = useState(false);
  const menuOpen = menuOpenProp ?? observed;
  const menuOpenRef = useRef(menuOpen);
  const prevMenuOpenRef = useRef(menuOpen);
  const [pressed, setPressed] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [expression, setExpression] = useState<Expression>("neutral");
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (menuOpenProp !== undefined) return;
    const button = document.querySelector(menuSelector);
    if (!button) return;
    const read = () =>
      setObserved(button.getAttribute("aria-expanded") === "true");
    read();
    const observer = new MutationObserver(read);
    observer.observe(button, {
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });
    return () => observer.disconnect();
  }, [menuSelector, menuOpenProp]);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
    if (prevMenuOpenRef.current !== menuOpen) {
      prevMenuOpenRef.current = menuOpen;
      controlsRef.current?.menuChanged(menuOpen);
    }
  }, [menuOpen]);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const last = { x: 0, y: 0, t: 0, vx: 0, vy: 0 };
    let reversals: number[] = [];
    let shakeUntil = 0;
    let lookUntil = 0;
    let lastPointer = 0;
    let busy = false;
    let base: Expression = "neutral";
    let shown: Expression = "neutral";
    let sensorsOn = false;
    let frame = 0;
    let exprTimer: ReturnType<typeof setTimeout> | undefined;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let blinkTimer: ReturnType<typeof setTimeout> | undefined;
    let blinkOffTimer: ReturnType<typeof setTimeout> | undefined;
    let blinkAgainTimer: ReturnType<typeof setTimeout> | undefined;
    let pressTimer: ReturnType<typeof setTimeout> | undefined;
    let scareTimer: ReturnType<typeof setTimeout> | undefined;
    let sleepTimer: ReturnType<typeof setTimeout> | undefined;
    let wakeTimers: ReturnType<typeof setTimeout>[] = [];

    const show = (e: Expression) => {
      shown = e;
      setExpression(e);
    };

    const setExpr = (e: Expression, ms = 0) => {
      clearTimeout(exprTimer);
      show(e);
      if (ms > 0) exprTimer = setTimeout(() => show(base), ms);
    };

    const clearWake = () => {
      wakeTimers.forEach(clearTimeout);
      wakeTimers = [];
    };

    const triggerShake = (ms: number) => {
      if (busy || base === "asleep") return;
      shakeUntil = Math.max(shakeUntil, performance.now() + ms);
      clearTimeout(exprTimer);
      show("shaking");
      exprTimer = setTimeout(
        () => setExpr("mad", 1500),
        shakeUntil - performance.now(),
      );
    };

    const wake = () => {
      clearWake();
      busy = true;
      base = "neutral";
      target.x = 0;
      target.y = 0;
      setSlow(true);
      const steps: [number, Expression][] = [
        [0, "sleepy"],
        [700, "asleep"],
        [1100, "sleepy"],
        [1800, "neutral"],
      ];
      steps.forEach(([ms, e]) =>
        wakeTimers.push(setTimeout(() => setExpr(e), ms)),
      );
      wakeTimers.push(
        setTimeout(() => {
          setSlow(false);
          busy = false;
          if (menuOpenRef.current) {
            base = "asleep";
            setExpr("asleep");
          }
        }, 2500),
      );
    };

    const fallAsleep = (button: Element) => {
      const root = rootRef.current;
      if (!root) return;
      clearWake();
      clearTimeout(scareTimer);
      clearTimeout(sleepTimer);
      const rb = root.getBoundingClientRect();
      const bb = button.getBoundingClientRect();
      const dx = bb.left + bb.width / 2 - (rb.left + rb.width / 2);
      const dy = bb.top + bb.height / 2 - (rb.top + rb.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      target.x = dx / len;
      target.y = dy / len;
      lookUntil = performance.now() + 1500;
      busy = true;
      base = "asleep";
      setSlow(true);
      setExpr("sleepy");
      scareTimer = setTimeout(() => {
        target.x = 0;
        target.y = 0.5;
        setExpr("asleep");
      }, 700);
      sleepTimer = setTimeout(() => {
        setSlow(false);
        busy = false;
      }, 1500);
    };

    const onDocClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      const button = el && el.closest ? el.closest(menuSelector) : null;
      if (button && !menuOpenRef.current) fallAsleep(button);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      lastPointer = performance.now();
      const root = rootRef.current;
      if (root && lastPointer >= lookUntil && base !== "asleep") {
        const rect = root.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        target.x = clamp((e.clientX - cx) / (window.innerWidth * 0.45));
        target.y = clamp((e.clientY - cy) / (window.innerHeight * 0.45));
      }

      const now = e.timeStamp;
      const dt = now - last.t;
      if (dt > 0 && dt < 100) {
        const vx = (e.clientX - last.x) / dt;
        const vy = (e.clientY - last.y) / dt;
        const speed = Math.hypot(vx, vy);
        const dot = vx * last.vx + vy * last.vy;
        if (speed > 1.4 && dot < 0) {
          reversals.push(now);
          reversals = reversals.filter((t) => now - t < 600);
          if (reversals.length >= 3) {
            triggerShake(900);
            reversals = [];
          }
        }
        last.vx = vx;
        last.vy = vy;
      } else {
        last.vx = 0;
        last.vy = 0;
      }
      last.x = e.clientX;
      last.y = e.clientY;
      last.t = now;
    };

    const onLeave = () => {
      if (busy) return;
      target.x = 0;
      target.y = 0;
    };

    const onUp = () => {
      clearTimeout(pressTimer);
      pressTimer = setTimeout(() => setPressed(false), 280);
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      if (performance.now() < lookUntil) return;
      target.x = clamp(e.gamma / 30);
      target.y = clamp((e.beta - 45) / 30);
    };

    const onMotion = (e: DeviceMotionEvent) => {
      let magnitude = 0;
      const a = e.acceleration;
      if (a && a.x != null && a.y != null && a.z != null) {
        magnitude = Math.hypot(a.x, a.y, a.z);
      } else {
        const g = e.accelerationIncludingGravity;
        if (g && g.x != null && g.y != null && g.z != null) {
          magnitude = Math.abs(Math.hypot(g.x, g.y, g.z) - 9.8);
        }
      }
      const r = e.rotationRate;
      const rotation = r
        ? Math.hypot(r.alpha ?? 0, r.beta ?? 0, r.gamma ?? 0)
        : 0;
      if (magnitude > 14 || rotation > 300) triggerShake(900);
    };

    const enableSensors = async () => {
      if (!tilt || sensorsOn) return;
      const Orientation = (
        window as unknown as { DeviceOrientationEvent?: PermissionEvent }
      ).DeviceOrientationEvent;
      if (!Orientation) return;
      try {
        if (typeof Orientation.requestPermission === "function") {
          const result = await Orientation.requestPermission();
          if (result !== "granted") return;
        }
      } catch {
        return;
      }
      sensorsOn = true;
      window.addEventListener("deviceorientation", onOrientation);
      window.addEventListener("devicemotion", onMotion);
    };

    const scheduleBlink = () => {
      blinkTimer = setTimeout(
        () => {
          setBlinking(true);
          blinkOffTimer = setTimeout(() => setBlinking(false), 150);
          if (Math.random() < 0.2) {
            blinkAgainTimer = setTimeout(() => {
              setBlinking(true);
              blinkOffTimer = setTimeout(() => setBlinking(false), 150);
            }, 320);
          }
          scheduleBlink();
        },
        2500 + Math.random() * 3500,
      );
    };

    const idleTick = () => {
      const now = performance.now();
      const calm =
        !busy &&
        base === "neutral" &&
        !sensorsOn &&
        (isTouch || now - lastPointer > 3000);
      if (calm) {
        if (Math.random() < 0.15) {
          target.x = 0;
          target.y = 0;
        } else {
          target.x = Math.random() * 2 - 1;
          target.y = Math.random() * 1.6 - 0.8;
        }
        if (shown === "neutral" && Math.random() < 0.4) {
          const action =
            idleActions[Math.floor(Math.random() * idleActions.length)];
          setExpr(action.expression, action.ms);
        }
      }
      idleTimer = setTimeout(idleTick, 1300 + Math.random() * 2200);
    };

    const tick = (t: number) => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;

      const active = t < shakeUntil;
      const jx = active ? Math.sin(t * 0.09) * size * 0.035 : 0;
      const jy = active ? Math.cos(t * 0.13) * size * 0.02 : 0;
      const jr = active ? Math.sin(t * 0.07) * 5 : 0;
      const breath =
        shown === "asleep" ? Math.sin(t * 0.003) * size * 0.012 : 0;

      if (faceRef.current) {
        faceRef.current.style.transform = `translate(${
          current.x * size * 0.05 + jx
        }px, ${current.y * size * 0.04 + jy + breath}px) rotate(${
          current.x * 5 + jr
        }deg)`;
      }
      if (eyesRef.current) {
        eyesRef.current.style.transform = `translate(${
          current.x * size * 0.08
        }px, ${current.y * size * 0.07}px)`;
      }
      if (mouthRef.current) {
        mouthRef.current.style.transform = `translate(${
          current.x * size * 0.1
        }px, ${current.y * size * 0.08}px)`;
      }

      frame = requestAnimationFrame(tick);
    };

    controlsRef.current = {
      press: () => {
        clearTimeout(pressTimer);
        setPressed(true);
        enableSensors();
      },
      menuChanged: (open) => {
        if (open) {
          if (!busy) {
            base = "asleep";
            setExpr("asleep");
          }
        } else {
          clearTimeout(scareTimer);
          clearTimeout(sleepTimer);
          wake();
        }
      },
    };

    if (menuOpenRef.current) {
      base = "asleep";
      show("asleep");
    }

    if (tilt) {
      const Orientation = (
        window as unknown as { DeviceOrientationEvent?: PermissionEvent }
      ).DeviceOrientationEvent;
      if (Orientation && typeof Orientation.requestPermission !== "function") {
        enableSensors();
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("click", onDocClick, true);
    scheduleBlink();
    idleTimer = setTimeout(idleTick, 1500);
    frame = requestAnimationFrame(tick);

    return () => {
      controlsRef.current = null;
      cancelAnimationFrame(frame);
      clearTimeout(exprTimer);
      clearTimeout(idleTimer);
      clearTimeout(blinkTimer);
      clearTimeout(blinkOffTimer);
      clearTimeout(blinkAgainTimer);
      clearTimeout(pressTimer);
      clearTimeout(scareTimer);
      clearTimeout(sleepTimer);
      clearWake();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("click", onDocClick, true);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, [size, tilt, menuSelector]);

  const shape = shapes[expression] ?? shapes.neutral;
  const closed = pressed || blinking;
  const ms = slow ? 500 : 120;
  const eyeW = size * shape.eyeW;

  const eyeStyle = (shut: boolean, side: 1 | -1) => {
    const h = shut ? size * 0.035 : size * shape.eyeH;
    const cut = shut ? 0 : (shape.eyeCut ?? 0);
    const clip =
      side === 1
        ? `polygon(0% 0%, 100% ${cut}%, 100% 100%, 0% 100%)`
        : `polygon(0% ${cut}%, 100% 0%, 100% 100%, 0% 100%)`;
    return {
      width: eyeW,
      height: h,
      borderRadius: Math.min(eyeW * 0.4, h / 2),
      background: color,
      clipPath: clip,
      transition: `height ${ms}ms ease, width ${ms}ms ease, border-radius ${ms}ms ease, clip-path ${ms}ms ease`,
    } as const;
  };

  return (
    <div
      ref={rootRef}
      className={className}
      aria-hidden="true"
      onPointerDown={() => controlsRef.current?.press()}
      style={{
        position: "relative",
        width: size,
        height: size,
        background,
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        ref={faceRef}
        style={{ position: "absolute", inset: 0, willChange: "transform" }}
      >
        <div
          ref={eyesRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "26%",
            height: size * 0.36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: size * 0.16,
            willChange: "transform",
          }}
        >
          <div style={eyeStyle(closed || expression === "wink", 1)} />
          <div style={eyeStyle(closed, -1)} />
        </div>
        <div
          ref={mouthRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "66%",
            height: size * 0.14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "transform",
          }}
        >
          <div
            style={{
              width: size * shape.mouthW,
              height: size * shape.mouthH,
              borderRadius: size * shape.mouthR,
              background: color,
              transition: `width ${ms}ms ease, height ${ms}ms ease, border-radius ${ms}ms ease`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
