"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type InstrumentId = "sax" | "piano" | "acoustic" | "electric";

type Instrument = {
  label: string;
  blurb: string;
  wave: OscillatorType;
  cutoff: number;
  attack: number;
  hold: number;
  level: number;
  length: number;
  drive?: boolean;
};

const INSTRUMENTS: Record<InstrumentId, Instrument> = {
  sax: {
    label: "Saxophone",
    blurb: "Warm and breathy. Notes swell in and hang a little.",
    wave: "sawtooth",
    cutoff: 1400,
    attack: 0.06,
    hold: 0.5,
    level: 0.8,
    length: 1.2,
  },
  piano: {
    label: "Piano",
    blurb: "Soft attack and a long, natural fade.",
    wave: "triangle",
    cutoff: 4000,
    attack: 0.005,
    hold: 0.01,
    level: 0.6,
    length: 1.7,
  },
  acoustic: {
    label: "Acoustic guitar",
    blurb: "Quick pluck, short ring.",
    wave: "triangle",
    cutoff: 2500,
    attack: 0.003,
    hold: 0.01,
    level: 0.4,
    length: 0.9,
  },
  electric: {
    label: "Electric guitar",
    blurb: "Bright, a little crunchy, a little loud.",
    wave: "sawtooth",
    cutoff: 3200,
    attack: 0.005,
    hold: 0.2,
    level: 0.6,
    length: 1.3,
    drive: true,
  },
};

type KeyDef = {
  note: string;
  freq: number;
  kbd: string;
  black: boolean;
  pos: number; // % desde la izquierda
};

const WHITE: [string, number, string][] = [
  ["C4", 261.63, "a"],
  ["D4", 293.66, "s"],
  ["E4", 329.63, "d"],
  ["F4", 349.23, "f"],
  ["G4", 392.0, "g"],
  ["A4", 440.0, "h"],
  ["B4", 493.88, "j"],
  ["C5", 523.25, "k"],
];

const BLACK: [string, number, string, number][] = [
  ["C#4", 277.18, "w", 1],
  ["D#4", 311.13, "e", 2],
  ["F#4", 369.99, "t", 4],
  ["G#4", 415.3, "y", 5],
  ["A#4", 466.16, "u", 6],
];

const KEYS: KeyDef[] = [
  ...WHITE.map(([note, freq, kbd], i) => ({
    note,
    freq,
    kbd,
    black: false,
    pos: i * 12.5,
  })),
  ...BLACK.map(([note, freq, kbd, n]) => ({
    note,
    freq,
    kbd,
    black: true,
    pos: n * 12.5,
  })),
];

const GLYPHS = ["♪", "♫", "♩"];

function makeDriveCurve(amount = 30) {
  const n = 256;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] =
      ((3 + amount) * x * 20 * (Math.PI / 180)) /
      (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export default function MusicPlayground() {
  const [instrument, setInstrument] = useState<InstrumentId>("sax");
  const [active, setActive] = useState<Set<string>>(new Set());
  const [floaters, setFloaters] = useState<
    { id: number; left: number; glyph: string }[]
  >([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const idRef = useRef(0);

  const play = useCallback(
    (freq: number) => {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!ctxRef.current) ctxRef.current = new AC();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const cfg = INSTRUMENTS[instrument];
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = cfg.wave;
      osc.frequency.value = freq;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = cfg.cutoff;

      const gain = ctx.createGain();
      const peak = 0.22;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(peak, t + cfg.attack);
      gain.gain.linearRampToValueAtTime(
        peak * cfg.level,
        t + cfg.attack + cfg.hold,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, t + cfg.length);

      osc.connect(filter);
      if (cfg.drive) {
        const shaper = ctx.createWaveShaper();
        shaper.curve = makeDriveCurve();
        filter.connect(shaper);
        shaper.connect(gain);
      } else {
        filter.connect(gain);
      }
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + cfg.length + 0.05);
    },
    [instrument],
  );

  const press = useCallback(
    (k: KeyDef) => {
      play(k.freq);
      setActive((prev) => new Set(prev).add(k.note));

      const id = ++idRef.current;
      const left = k.black ? k.pos : k.pos + 6.25;
      const glyph = GLYPHS[id % GLYPHS.length];
      setFloaters((f) => [...f.slice(-8), { id, left, glyph }]);
      setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1300);
    },
    [play],
  );

  const release = useCallback((note: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  }, []);

  // Teclado de la computadora
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      const k = KEYS.find((x) => x.kbd === e.key.toLowerCase());
      if (k) press(k);
    };
    const up = (e: KeyboardEvent) => {
      const k = KEYS.find((x) => x.kbd === e.key.toLowerCase());
      if (k) release(k.note);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [press, release]);

  const keyHandlers = (k: KeyDef) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      press(k);
    },
    onPointerUp: () => release(k.note),
    onPointerLeave: () => release(k.note),
    onPointerCancel: () => release(k.note),
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.buttons === 1) press(k);
    },
    // Activación con teclado (Enter / Espacio sobre el botón enfocado)
    onClick: (e: React.MouseEvent) => {
      if (e.detail === 0) {
        press(k);
        setTimeout(() => release(k.note), 150);
      }
    },
  });

  return (
    <div>
      <style>{`
        @keyframes piano-note {
          0% { transform: translate(-50%, 0) rotate(-8deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translate(-50%, -90px) rotate(14deg); opacity: 0; }
        }
      `}</style>

      <div
        role="group"
        aria-label="Choose an instrument"
        className="flex flex-wrap justify-center gap-2"
      >
        {(Object.keys(INSTRUMENTS) as InstrumentId[]).map((id) => {
          const selected = id === instrument;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => setInstrument(id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 sm:px-4 sm:py-2 sm:text-sm ${
                selected
                  ? "border-slate-800 bg-slate-800 text-white dark:border-white dark:bg-white dark:text-slate-900"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white"
              }`}
            >
              {INSTRUMENTS[id].label}
            </button>
          );
        })}
      </div>

      <p
        key={instrument}
        className="mt-4 text-center text-sm text-slate-600 sm:text-base dark:text-slate-400"
      >
        {INSTRUMENTS[instrument].blurb}
      </p>

      <div className="relative mx-auto mt-10 h-44 w-full max-w-xl touch-manipulation select-none sm:h-56">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-2 h-0 motion-reduce:hidden"
        >
          {floaters.map((f) => (
            <span
              key={f.id}
              className="absolute text-2xl text-slate-500 dark:text-slate-400"
              style={{
                left: `${f.left}%`,
                animation: "piano-note 1.2s ease-out forwards",
              }}
            >
              {f.glyph}
            </span>
          ))}
        </div>

        <div className="flex h-full gap-1">
          {KEYS.filter((k) => !k.black).map((k) => (
            <button
              key={k.note}
              type="button"
              aria-label={`Play ${k.note}`}
              {...keyHandlers(k)}
              className={`flex flex-1 items-end justify-center rounded-b-2xl border pb-2 transition-[translate,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-slate-800 dark:focus-visible:outline-white ${
                active.has(k.note)
                  ? "translate-y-1 border-slate-400 bg-slate-300 dark:border-slate-500 dark:bg-slate-400"
                  : "border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-200 dark:hover:bg-slate-100"
              }`}
            >
              <span className="hidden text-xs uppercase text-slate-400 sm:block">
                {k.kbd}
              </span>
            </button>
          ))}
        </div>

        {KEYS.filter((k) => k.black).map((k) => (
          <button
            key={k.note}
            type="button"
            aria-label={`Play ${k.note}`}
            {...keyHandlers(k)}
            style={{ left: `${k.pos}%` }}
            className={`absolute top-0 h-[60%] w-[7%] -translate-x-1/2 rounded-b-xl border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-slate-800 dark:focus-visible:outline-white ${
              active.has(k.note)
                ? "border-slate-600 bg-slate-600"
                : "border-slate-800 bg-slate-800 hover:bg-slate-700 dark:border-slate-600 dark:bg-slate-900"
            }`}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Tap the keys, or use A S D F G H J K on your keyboard.
      </p>
    </div>
  );
}
