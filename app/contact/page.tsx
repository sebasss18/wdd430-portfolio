// Página con información y opciones para ponerse en contacto.
import type { Metadata } from "next";
import Reveal from "@/components/effects/Reveal";
import RevealText from "@/components/effects/RevealText";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Sebastian Bernal to ask about a project, discuss web development, or connect through email, phone, and social media.",
};

type ContactItem = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

type Group = { title: string; items: ContactItem[] };

const groups: Group[] = [
  {
    title: "Direct",
    items: [
      {
        label: "Email",
        value: "sebasbernals11@gmail.com",
        href: "mailto:sebasbernals11@gmail.com",
      },
      {
        label: "Phone",
        value: "662-141-5468",
        href: "tel:+526621415468",
      },
    ],
  },
  {
    title: "Social",
    items: [
      {
        label: "Instagram",
        value: "@seb_sso",
        href: "https://www.instagram.com/seb_sso",
        external: true,
      },
      {
        label: "Facebook",
        value: "Sebastián Bernal",
        href: "https://www.facebook.com/share/1Ckd6AK73a/?mibextid=wwXIfr",
        external: true,
      },
    ],
  },
];

function Row({ label, value, href, external }: ContactItem) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 transition-[scale,border-color] duration-500 ease-[cubic-bezier(0.25,1.12,0.35,1)] hover:scale-[1.03] hover:border-slate-800 focus-visible:scale-[1.03] focus-visible:border-slate-800 focus-visible:outline-none sm:rounded-3xl sm:px-7 sm:py-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-200 dark:focus-visible:border-slate-200"
    >
      <div className="min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 truncate text-lg font-semibold tracking-tight sm:text-2xl">
          {value}
        </p>
      </div>

      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-all duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:-rotate-45 group-hover:scale-110 group-hover:border-slate-800 group-hover:bg-slate-800 group-hover:text-white group-focus-visible:-rotate-45 group-focus-visible:border-slate-800 group-focus-visible:bg-slate-800 group-focus-visible:text-white dark:border-slate-600 dark:text-slate-200 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-slate-900 dark:group-focus-visible:border-white dark:group-focus-visible:bg-white dark:group-focus-visible:text-slate-900">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

export default function Contact() {
  return (
    <main className="min-h-screen overflow-x-hidden px-5 py-10 text-slate-900 sm:px-4 sm:py-16 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                Let’s talk
              </h1>
            </Reveal>

            <RevealText className="mt-4 max-w-md text-base text-slate-600 sm:mt-6 sm:text-lg dark:text-slate-400">
              I’d love to hear from you. If you have a question, want to talk
              about a project, or would like to connect, feel free to reach out.
            </RevealText>
          </div>
        </div>

        <div className="space-y-10 lg:col-span-3">
          {groups.map((group, g) => (
            <section
              key={group.title}
              aria-labelledby={`${group.title}-heading`}
            >
              <Reveal retraso={g * 100}>
                <h2
                  id={`${group.title}-heading`}
                  className="mb-4 font-label text-sm uppercase tracking-[0.35em] text-slate-500 sm:text-base dark:text-slate-400"
                >
                  {group.title}
                </h2>
              </Reveal>

              <div className="space-y-3 sm:space-y-4">
                {group.items.map((item, i) => (
                  <Reveal key={item.label} retraso={g * 100 + i * 80}>
                    <Row {...item} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
