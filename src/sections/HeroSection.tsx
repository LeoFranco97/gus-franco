import FadeIn from '../components/FadeIn'
import PhotoWall from '../components/PhotoWall'
import { ContactButton } from '../components/Buttons'
import { nav, profile } from '../data/site'

/**
 * Hero.
 *
 * Three bands, stacked in normal flow:
 *
 *   1. Top band, on clean black: nav and the name. Nothing sits behind the
 *      headline at any viewport, which is structural rather than a tuned
 *      margin: a flex column with the wall as flex-1 makes a collision
 *      between the headline and the picture well impossible by construction.
 *   2. Picture well: the wall of photographs, full bleed, taking whatever
 *      height is left.
 *   3. Bottom bar: positioning line and CTA, floated over the wall on a
 *      scrim so the text keeps contrast whatever frame is passing underneath
 *      it. Never trust the picture to be dark in that spot.
 *
 * Height comes from `.hero-viewport` (see src/index.css), not from h-screen:
 * on iOS Safari 100vh is taller than the visible page and hides band 3.
 */
export default function HeroSection() {
  return (
    <section className="hero-viewport relative flex flex-col overflow-hidden bg-[#0C0C0C]">
      {/* 1. Top band */}
      <div className="relative z-20 shrink-0 bg-[#0C0C0C] pb-6 md:pb-8">
        <FadeIn delay={0} y={-20}>
          {/* The wordmark is hidden on phones. At 375px the brand plus four
              links measure 384px against 327px of usable width, so the last
              link ("Contato") was clipped at the right edge. The headline
              directly below already says whose site this is, so the wordmark
              is what gives way. */}
          <nav className="flex items-baseline justify-between gap-4 px-6 pt-6 md:px-10 md:pt-8">
            <span className="hidden text-sm font-semibold uppercase tracking-[0.3em] text-[#D7E2EA] sm:inline md:text-lg lg:text-xl">
              {profile.brand}
            </span>
            <span className="flex w-full justify-between gap-4 sm:w-auto sm:justify-end sm:gap-5 md:gap-8">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs font-medium uppercase tracking-wide text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 sm:tracking-wider md:text-base lg:text-lg"
                >
                  {item.label}
                </a>
              ))}
            </span>
          </nav>
        </FadeIn>

        <div className="overflow-hidden">
          <FadeIn delay={0.15} y={40}>
            <h1
              className="hero-heading mt-8 w-full whitespace-nowrap text-center font-black uppercase leading-none tracking-tight sm:mt-9 md:mt-10"
              style={{ fontSize: 'clamp(2.5rem, 11.2vw, 15rem)' }}
            >
              Oi, eu sou o {profile.firstName}
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* 2. Picture well. Entry delay near zero: the work is the point, it
          should not arrive last. min-h-0 lets the flex child actually shrink. */}
      <div className="relative z-0 min-h-0 flex-1">
        <FadeIn delay={0} duration={0.5} y={0} className="h-full">
          <div
            className="h-full"
            role="img"
            aria-label="Fotografias de Gus Franco: casamentos, elopements, retratos e documentário"
          >
            <PhotoWall />
          </div>
        </FadeIn>
      </div>

      {/* 3. Scrim, then the bar itself.
          Height tracks viewport width, because that is what drives how tall
          the bar gets: the positioning line wraps to three lines at 1280 and
          five at 1920. A flat 180px leaves the top lines unprotected at 1920,
          and a flat 340px eats three quarters of the wall at 1280.
          The curve is denser than a plain linear fade: at the top edge of the
          text the veil sits around 0.70, which still holds roughly 4.8:1 in
          the worst case of a bright frame passing right there, and the text
          shadow below covers the rest. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: 'clamp(180px, 15vw, 300px)',
          background:
            'linear-gradient(to top, #0C0C0C 0%, rgba(12,12,12,0.97) 28%, rgba(12,12,12,0.88) 52%, rgba(12,12,12,0.68) 72%, rgba(12,12,12,0.30) 88%, rgba(12,12,12,0) 100%)',
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[280px]"
            style={{
              fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)',
              // Belt and braces over the scrim, for the frame where a bright
              // picture happens to be passing right under the line.
              textShadow: '0 1px 10px rgba(0,0,0,0.85)',
            }}
          >
            {profile.heroLine}
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
