import FadeIn from '../components/FadeIn'
import { press, published } from '../data/site'

/**
 * Press.
 *
 * The proof section. One lead quote carrying the argument, the awards as a
 * three-up, then the shorter citations and the publication strip. Each quote
 * stays in the language it was published in, because translating a citation
 * is editing someone else's words.
 */
export default function PressSection() {
  return (
    <section id="imprensa" className="bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Imprensa
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} y={30}>
          <blockquote className="mx-auto mt-12 max-w-3xl text-center sm:mt-16">
            <p
              className="font-light italic leading-snug text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1.15rem, 2.6vw, 2rem)' }}
            >
              &ldquo;{press.lead.quote}&rdquo;
            </p>
            <footer className="mt-5 text-xs font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/50 sm:text-sm">
              {press.lead.source}
            </footer>
          </blockquote>
        </FadeIn>

        <FadeIn delay={0.1} y={30}>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-sm bg-[#D7E2EA]/12 sm:mt-20 sm:grid-cols-3">
            {press.awards.map((a) => (
              <li key={a.title + a.source} className="bg-[#0C0C0C] px-6 py-7 text-center">
                <p className="text-lg font-semibold uppercase tracking-wide text-[#D7E2EA] sm:text-xl">
                  {a.title}
                </p>
                <p className="mt-1.5 text-sm font-light uppercase tracking-wider text-[#D7E2EA]/70">
                  {a.source}
                </p>
                <p className="mt-1 text-[0.65rem] font-light uppercase tracking-widest text-[#D7E2EA]/40">
                  {a.note}
                </p>
              </li>
            ))}
          </ul>
        </FadeIn>

        <div className="mt-14 grid gap-x-12 gap-y-7 sm:mt-20 sm:grid-cols-2">
          {press.quotes.map((q, i) => (
            <FadeIn key={q.source} delay={0.05 * i} y={24}>
              <blockquote className="border-l border-[#D7E2EA]/20 pl-5">
                <p className="text-sm font-light italic leading-relaxed text-[#D7E2EA]/80 sm:text-base">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <footer className="mt-2 text-[0.65rem] font-medium uppercase tracking-widest text-[#D7E2EA]/40 sm:text-xs">
                  {q.source}
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1} y={24}>
          <div className="mt-16 border-t border-[#D7E2EA]/12 pt-8">
            <h3 className="mb-5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/40">
              Imagens publicadas em
            </h3>
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {published.map((p) => (
                <li
                  key={p}
                  className="text-sm font-light uppercase tracking-wider text-[#D7E2EA]/70 sm:text-base"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
