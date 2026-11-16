import type { Metadata } from "next";
import Reveal from "@/components/effects/Reveal";
import RevealText from "@/components/effects/RevealText";
import DotField from "@/components/effects/DotField";
import Parallax from "@/components/effects/Parallax";
import SplitTitle from "@/components/effects/SplitTitle";
import CodeScene from "@/components/effects/CodeScene";
import PathScroll from "@/components/effects/PathScroll";
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
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M7.5 10.5l3 2.5-3 2.5" />
        <path d="M13 15.5h3.5" />
      </>
    ),
  },
  {
    title: "Music",
    text: "I play saxophone, piano, acoustic guitar, and electric guitar. Music is life to me",
    icon: (
      <>
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="17.5" cy="15.5" r="2.5" />
        <path d="M9 18V5.5L20 3v12.5" />
        <path d="M9 9.5L20 7" />
      </>
    ),
  },
  {
    title: "Video games",
    text: "I love video games. I think everyone has enjoyed playing video games at least once in their life. It’s not just about enjoying the story or the gameplay, but also about the moments you share when playing with your brothers, friends, or even family. Video games have been a big part of my childhood and continue to be a part of my life",
    icon: (
      <>
        <path d="M7.5 6.5h9a5.5 5.5 0 0 1 5.4 4.5l.6 3.8a2.7 2.7 0 0 1-4.7 2.2l-1.5-1.9H9.7l-1.5 1.9a2.7 2.7 0 0 1-4.7-2.2l.6-3.8A5.5 5.5 0 0 1 7.5 6.5z" />
        <path d="M8 9.5v3M6.5 11h3" />
        <circle cx="16" cy="10.2" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="18.4" cy="12.4" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    title: "Pickleball",
    text: "I play pickleball. with friends, family, its a good break from the screen.",
    icon: (
      <>
        <g transform="rotate(-40 9 10.5)">
          <rect x="4" y="2" width="10" height="12" rx="5" />
          <path d="M9 14v6" />
        </g>
        <circle cx="18.5" cy="5.8" r="3" />
        <circle cx="17.6" cy="5" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="19.5" cy="5.2" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="18.4" cy="7" r="0.5" fill="currentColor" stroke="none" />
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
    <main className="about-page overflow-x-clip bg-slate-950 text-slate-100">
      <section className="relative min-h-dvh overflow-hidden px-5 sm:px-12">
        <DotField />
        <Parallax
          speed={0.2}
          fade
          className="relative flex min-h-dvh flex-col justify-end pb-16 pt-28 sm:pb-20"
        >
          <Reveal>
            <span className="text-big font-medium tracking-wide text-slate-400">
              Web Development Student
            </span>
          </Reveal>
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
            <h1
              aria-label="About me"
              className="mt-4 text-[27vw] font-bold leading-[0.8] tracking-tighter sm:text-[length:min(19vw,26dvh)] [&_*]:!overflow-visible"
            >
              <span className="block">
                <SplitTitle text="About" />
              </span>
              <span className="text-outline block pl-[10vw] sm:pl-[8vw] lg:pl-[6vw]">
                <SplitTitle text="me" delay={700} />
              </span>
            </h1>
            <div className="mt-10 max-w-sm sm:ml-auto sm:mr-[6vw] sm:max-w-md lg:ml-0 lg:mr-[3vw] lg:mt-0 lg:shrink-0 lg:pb-4">
              <RevealText className="text-base text-slate-400 sm:text-lg">
                I’m a web development student interested in building responsive
                and interactive web applications. I enjoy learning new
                technologies and applying them to projects that help me improve
                my development skills.
              </RevealText>
              <RevealText className="mt-4 text-base text-slate-400 sm:text-lg">
                I’m 20 years old, and when I’m not coding you’ll probably find
                me playing music, playing games, or out on the pickleball court.
              </RevealText>
            </div>
          </div>
        </Parallax>
      </section>

      <ScrollRuler
        items={["Programming", "Music", "Video games", "Pickleball", "Design"]}
      />
      <PathScroll label="What I’m into" items={hobbies} />
      <CodeScene code={profileCode} />
    </main>
  );
}
