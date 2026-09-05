import { Container } from "./container";

/**
 * Standard page opener — display-2, one line of intro, optional mono count.
 * Deliberately not full-viewport: the first section has to peek (spec §9.2).
 */
export function PageHero({
  title,
  intro,
  meta,
}: {
  title: string;
  intro: string;
  meta?: string;
}) {
  return (
    <div className="py-16 lg:py-24">
      <Container>
        <h1 className="t-display-2 max-w-[16ch]">{title}</h1>
        <p className="t-body-lg measure-copy mt-6 text-ink-2">{intro}</p>
        {meta ? <p className="t-mono-sm mt-8 text-ink-3">{meta}</p> : null}
      </Container>
    </div>
  );
}
