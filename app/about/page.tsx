import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import RevealText from "../../components/RevealText";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Sebastian Bernal, a 20-year-old web development student who loves programming, music, video games, and pickleball.",
};

const hobbies = [
  {
    title: "Programming",
    text: "I love programming. Turning an idea into something people can click, swipe, and use is my favorite kind of puzzle.",
    anim: "group-hover:rotate-90",
    icon: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />,
  },
  {
    title: "Music",
    text: "I play saxophone, piano, acoustic guitar, and electric guitar. Music is how I switch off and recharge.",
    anim: "group-hover:scale-125",
    icon: (
      <>
        <path d="M9.5 18V6l10-2v12" />
        <circle cx="7" cy="18" r="2.5" />
        <circle cx="17" cy="16" r="2.5" />
      </>
    ),
  },
  {
    title: "Video games",
    text: "I like video games for the fun and for the design. Good games feel smooth, and I try to bring that feeling to my interfaces.",
    anim: "group-hover:-rotate-12 group-hover:scale-110",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="11" rx="5.5" />
        <path d="M7 10v4M5 12h4" />
        <circle cx="16" cy="11" r="0.8" />
        <circle cx="18.5" cy="13.5" r="0.8" />
      </>
    ),
  },
  {
    title: "Pickleball",
    text: "I like playing pickleball. Quick rallies, good company, and a break from the screen.",
    anim: "group-hover:animate-bounce",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="9" cy="9" r="0.9" />
        <circle cx="15" cy="9" r="0.9" />
        <circle cx="12" cy="12" r="0.9" />
        <circle cx="9" cy="15" r="0.9" />
        <circle cx="15" cy="15" r="0.9" />
      </>
    ),
  },
];

const profileCode = `const sebastian = {
  age: 20,
  role: "Web development student",
  loves: ["programming", "music", "video games", "pickleball"],
  plays: ["saxophone", "piano", "acoustic guitar", "electric guitar"],
  status: "always learning",
};`;

export default function About() {
  return (
    <main className="min-h-screen overflow-x-hidden px-5 py-10 text-slate-900 sm:px-4 sm:py-16 dark:bg-slate-950 dark:text-slate-100">
      <style>{`
        @keyframes about-note {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(26px, -90px) rotate(18deg); opacity: 0; }
        }
      `}</style>

      <section className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-5 lg:gap-14">
        <div className="lg:col-span-3">
          <Reveal>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              About me
            </h1>
          </Reveal>

          <RevealText className="mt-4 max-w-xl text-base text-slate-600 sm:mt-6 sm:text-lg dark:text-slate-400">
            I’m a web development student interested in building responsive and
            interactive web applications. I enjoy learning new technologies and
            applying them to projects that help me improve my development
            skills.
          </RevealText>

          <RevealText className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg dark:text-slate-400">
            I’m 20 years old, and when I’m not coding you’ll probably find me
            playing music, playing games, or out on the pickleball court.
          </RevealText>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl sm:mt-28">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            What I’m into
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
          {hobbies.map((h, i) => (
            <Reveal key={h.title} retraso={i * 80}>
              <div className="group flex h-full gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-[scale,border-color] duration-500 ease-[cubic-bezier(0.25,1.12,0.35,1)] hover:scale-[1.03] hover:border-slate-800 sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-200">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors duration-500 group-hover:border-slate-800 group-hover:bg-slate-800 group-hover:text-white dark:border-slate-600 dark:text-slate-200 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-slate-900">
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] ${h.anim}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {h.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {h.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-400">
                    {h.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl sm:mt-28">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            The short version
          </h2>
        </Reveal>

        <Reveal retraso={100}>
          <pre className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-slate-700 sm:p-8 sm:text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <code>{profileCode}</code>
          </pre>
        </Reveal>
      </section>

      <Reveal>
        <div className="mt-16 flex justify-center sm:mt-24">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-slate-800 py-3 pl-8 pr-4 font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 dark:bg-slate-700"
          >
            Say hi
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 transition-transform duration-500 group-hover:-rotate-45">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
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
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
