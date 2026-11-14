// Página biográfica con intereses personales y escenas visuales interactivas.
import type { Metadata } from "next";
import Reveal from "@/components/effects/Reveal";
import RevealText from "@/components/effects/RevealText";
import DotField from "@/components/effects/DotField";
import Parallax from "@/components/effects/Parallax";
import SplitTitle from "@/components/effects/SplitTitle";
import CodeScene from "@/components/effects/CodeScene";
import OrbitScroll from "@/components/effects/OrbitScroll";
import ScrollRuler from "@/components/effects/ScrollRuler";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Sebastian Bernal, a 20-year-old web development student who loves programming, music, video games, and pickleball.",
};

const hobbies = [
  {
    title: "Programming",
    text: "I love programming. Turning an idea into something people can click, swipe, and use is my favorite kind of puzzle. And design it's my favorite part of it!",
    icon: (
      <>
        <rect x="2.5" y="4" width="19" height="16" rx="3" />
        <path d="M2.5 8.5h19" />
        <path d="M7 12l3 2.5L7 17" />
        <path d="M12.5 17H17" />
      </>
    ),
  },
  {
    title: "Music",
    text: "I play saxophone, piano, acoustic guitar, and electric guitar. Music is life to me.",
    icon: (
      <>
        <circle cx="7" cy="17.5" r="2.3" />
        <circle cx="17" cy="15.5" r="2.3" />
        <path d="M9.3 17.5V6.5" />
        <path d="M19.3 15.5V4.5" />
        <path d="M9.3 6.5l10-2" />
        <path d="M9.3 10l10-2" />
      </>
    ),
  },
  {
    title: "Video games",
    text: "I like video games. Good games feel smooth, and I try to bring that feeling to my interfaces.",
    icon: (
      <>
        <path d="M7 6.5h10a4.5 4.5 0 0 1 4.4 5.4l-.9 4.2a2.8 2.8 0 0 1-4.8 1.3l-2.1-1.9h-3.2l-2.1 1.9a2.8 2.8 0 0 1-4.8-1.3l-.9-4.2A4.5 4.5 0 0 1 7 6.5z" />
        <path d="M7 10v3.5M5.25 11.75h3.5" />
        <circle cx="16" cy="10.5" r="0.7" />
        <circle cx="18" cy="12.5" r="0.7" />
      </>
    ),
  },
  {
    title: "Pickleball",
    text: "I like playing pickleball. good company, and a break from the screen.",
    icon: (
      <>
        <g transform="rotate(-35 10 11)">
          <rect x="5" y="2.5" width="10" height="12.5" rx="5" />
          <path d="M10 15v5.5M8.5 20.5h3" />
          <circle cx="8.5" cy="7" r="0.55" />
          <circle cx="11.5" cy="7" r="0.55" />
          <circle cx="10" cy="10" r="0.55" />
        </g>
        <circle cx="18.5" cy="6" r="2.8" />
        <circle cx="17.6" cy="5.2" r="0.45" />
        <circle cx="19.4" cy="5.2" r="0.45" />
        <circle cx="18.5" cy="7" r="0.45" />
      </>
    ),
  },
];

const layouts = [
  {
    box: "items-end justify-start pb-24 sm:pb-32",
    text: "items-start text-left",
    num: "right-0",
    speed: -14,
  },
  {
    box: "items-start justify-end pt-28 sm:pt-36",
    text: "items-end text-right",
    num: "left-0",
    speed: 12,
  },
  {
    box: "items-center justify-start sm:pl-[8vw]",
    text: "items-start text-left",
    num: "right-0",
    speed: -20,
  },
  {
    box: "items-end justify-end pb-24 sm:pb-32",
    text: "items-end text-right",
    num: "left-0",
    speed: 16,
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
    <main className="overflow-x-clip text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative min-h-screen overflow-hidden px-5 sm:px-12">
        <DotField />
        <Parallax
          speed={0.2}
          fade
          className="relative flex min-h-screen flex-col justify-end pb-20 pt-32 sm:pb-24"
        >
          <Reveal>
            <span className="text-big font-medium tracking-wide text-slate-500 dark:text-slate-400">
              Web Development Student
            </span>
          </Reveal>
          <h1
            aria-label="About me"
            className="mt-4 text-[27vw] font-bold leading-[0.8] tracking-tighter sm:text-[19vw] [&_*]:!overflow-visible"
          >
            <span className="block">
              <SplitTitle text="About" />
            </span>
            <span className="text-outline block pl-[10vw] sm:pl-[16vw]">
              <SplitTitle text="me" delay={700} />
            </span>
          </h1>
          <div className="mt-10 max-w-sm sm:ml-auto sm:mr-[6vw] sm:mt-0 sm:max-w-md">
            <RevealText className="text-base text-slate-600 sm:text-lg dark:text-slate-400">
              I’m a web development student interested in building responsive
              and interactive web applications. I enjoy learning new
              technologies and applying them to projects that help me improve my
              development skills.
            </RevealText>
            <RevealText className="mt-4 text-base text-slate-600 sm:text-lg dark:text-slate-400">
              I’m 20 years old, and when I’m not coding you’ll probably find me
              playing music, playing games, or out on the pickleball court.
            </RevealText>
          </div>
        </Parallax>
      </section>

      <ScrollRuler
        items={[
          "Programming",
          "Music",
          "Video games",
          "Pickleball",
          "Design",
          "Always learning",
        ]}
      />
      <OrbitScroll label="What I’m into" items={hobbies} />
      <CodeScene code={profileCode} />
    </main>
  );
}
