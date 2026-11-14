type Props = {
  text: string;
  delay?: number;
};

export default function SplitTitle({ text, delay = 300 }: Props) {
  let n = 0;
  return (
    <>
      {text.split(" ").map((word, wi) => (
        <span
          key={wi}
          aria-hidden="true"
          className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-bottom"
        >
          {Array.from(word).map((ch, ci) => (
            <span
              key={ci}
              className="rise inline-block"
              style={{ animationDelay: `${delay + n++ * 55}ms` }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}
