// Contador animado que incrementa hasta el valor indicado.
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface ContadorProps {
  valor: number;
  duracion?: number;
  retraso?: number;
}

const digitos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

export default function Contador({
  valor,
  duracion = 1600,
  retraso = 0,
}: ContadorProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [activo, setActivo] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeout: ReturnType<typeof setTimeout>;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          timeout = setTimeout(() => setActivo(true), retraso);
          observador.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observador.observe(el);

    return () => {
      observador.disconnect();
      clearTimeout(timeout);
    };
  }, [retraso]);

  const texto = String(valor).padStart(2, "0");
  const visible = activo || prefersReducedMotion;

  return (
    <span ref={ref} className="inline-flex" aria-label={texto} role="text">
      {texto.split("").map((digito, i) => {
        const destino = visible ? Number(digito) : 0;

        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block h-[1.1em] overflow-hidden leading-[1.1em]"
          >
            <span
              className="flex flex-col motion-reduce:transition-none"
              style={{
                transform: `translateY(-${destino * 10}%)`,
                transition: `transform ${duracion + i * 250}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              {digitos.map((d) => (
                <span key={d} className="block h-[1.1em] leading-[1.1em]">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
