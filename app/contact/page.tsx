import type { Metadata } from "next";
import Reveal from "@/components/effects/Reveal";
import RevealText from "@/components/effects/RevealText";
import DotField from "@/components/effects/DotField";
import SplitTitle from "@/components/effects/SplitTitle";

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

function Row({
  label,
  value,
  href,
  external,
  index,
}: ContactItem & { index: number }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group relative block overflow-hidden border-b border-slate-300 focus-visible:outline-none dark:border-slate-800"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 group-active:scale-y-100 dark:bg-white"
      />
      <div className="relative flex items-center gap-4 px-1 py-6 transition-colors duration-500 group-hover:text-white group-focus-visible:text-white group-active:text-white sm:gap-8 sm:px-4 sm:py-9 dark:group-hover:text-slate-900 dark:group-focus-visible:text-slate-900 dark:group-active:text-slate-900">
        <span className="font-label w-6 shrink-0 text-xs tracking-[0.3em] text-slate-400 transition-colors duration-500 group-hover:text-slate-300 dark:text-slate-600 dark:group-hover:text-slate-500 sm:w-10 sm:text-sm">
          {String(index).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 transition-colors duration-500 group-hover:text-slate-300 dark:text-slate-400 dark:group-hover:text-slate-500 sm:text-xs">
            {label}
          </p>
          <p className="mt-1 break-words text-xl font-bold tracking-tighter transition-transform duration-500 ease-[cubic-bezier(0.25,1.12,0.35,1)] group-hover:translate-x-2 sm:text-4xl lg:text-5xl">
            {value}
          </p>
        </div>

        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:-rotate-45 group-focus-visible:-rotate-45 sm:h-8 sm:w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>
    </a>
  );
}

export default function Contact() {
  return (
    <main className="min-h-dvh overflow-x-clip text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden px-5 pb-10 pt-28 sm:px-12 sm:pb-16 sm:pt-36">
        <DotField />
        <div className="relative mx-auto max-w-6xl lg:flex lg:items-end lg:justify-between lg:gap-12">
          <h1
            aria-label="Let’s talk"
            className="text-[22vw] font-bold leading-[0.85] tracking-tighter sm:text-[length:min(14vw,24dvh)] [&_*]:!overflow-visible"
          >
            <span className="block">
              <SplitTitle text="Let’s" />
            </span>
            <span className="text-outline block pl-[8vw] lg:pl-[5vw]">
              <SplitTitle text="talk" delay={500} />
            </span>
          </h1>

          <RevealText className="mt-8 max-w-sm text-base text-slate-600 sm:text-lg lg:mb-3 lg:mt-0 lg:shrink-0 dark:text-slate-400">
            I’d love to hear from you. If you have a question, want to talk
            about a project, or would like to connect, feel free to reach out.
          </RevealText>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-12">
        {groups.map((group, g) => {
          const offset = groups
            .slice(0, g)
            .reduce((total, current) => total + current.items.length, 0);

          return (
            <div key={group.title} className="mb-12 last:mb-0">
              <Reveal retraso={g * 100}>
                <h2 className="font-label mb-2 text-xs uppercase tracking-[0.35em] text-slate-500 sm:text-sm dark:text-slate-400">
                  {group.title}
                </h2>
              </Reveal>

              <div className="border-t border-slate-300 dark:border-slate-800">
                {group.items.map((item, i) => (
                  <Reveal key={item.label} retraso={g * 100 + i * 80}>
                    <Row {...item} index={offset + i + 1} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
