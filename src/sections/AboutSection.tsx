import FadeIn from '../components/FadeIn'
import AnimatedText from '../components/AnimatedText'
import { ContactButton } from '../components/Buttons'
import { aboutMore, aboutText, brands, img, portrait, profile, totalPhotos } from '../data/site'

/**
 * Soft colour wash in the corners, built in CSS rather than with stock
 * renders. The three stops are amber, clay and deep teal, taken off the
 * photography so the page glows in the same range as the work.
 */
function Glow({ className, color }: { className: string; color: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-[90px] ${className}`}
      style={{ background: color }}
    />
  )
}

const facts = [
  { value: '15+', label: 'anos de carreira' },
  { value: '4', label: 'continentes' },
  { value: String(totalPhotos), label: 'fotos neste site' },
]

export default function AboutSection() {
  return (
    <section
      id="sobre"
      className="relative overflow-hidden px-5 py-20 sm:px-8 md:px-10 md:py-28"
    >
      <Glow className="left-[-10%] top-[8%] h-[280px] w-[280px] opacity-40 md:h-[420px] md:w-[420px]" color="#8C5A2B" />
      <Glow className="right-[-8%] top-[24%] h-[220px] w-[220px] opacity-30 md:h-[340px] md:w-[340px]" color="#C2763A" />
      <Glow className="bottom-[6%] left-[18%] h-[200px] w-[200px] opacity-25 md:h-[300px] md:w-[300px]" color="#2E4A52" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Sobre
          </h2>
        </FadeIn>

        {/* Portrait and the opening paragraph, side by side: the same split
            his own Sobre page uses. */}
        <div className="mt-12 grid items-center gap-10 sm:mt-16 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-14">
          <FadeIn delay={0.1} y={30}>
            <img
              src={img(portrait)}
              alt={profile.fullName}
              loading="lazy"
              decoding="async"
              width={1280}
              height={1920}
              className="mx-auto w-full max-w-[300px] rounded-sm object-cover ring-1 ring-[#D7E2EA]/15"
            />
          </FadeIn>

          <div>
            <AnimatedText
              text={aboutText}
              className="font-medium leading-relaxed text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1rem, 1.9vw, 1.3rem)' }}
            />

            <FadeIn delay={0.1} y={24}>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dd className="text-2xl font-semibold leading-none text-[#D7E2EA] sm:text-3xl">
                      {f.value}
                    </dd>
                    <dt className="mt-1 text-[0.65rem] font-light uppercase tracking-widest text-[#D7E2EA]/45 sm:text-xs">
                      {f.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>
        </div>

        {/* The rest of the biography, set as a quiet two-column read so it
            does not compete with the opening paragraph. */}
        <FadeIn delay={0.1} y={30}>
          <div className="mt-14 grid gap-6 border-t border-[#D7E2EA]/12 pt-10 md:grid-cols-3 md:gap-10">
            {aboutMore.map((p, i) => (
              <p key={i} className="text-sm font-light leading-relaxed text-[#D7E2EA]/65">
                {p}
              </p>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15} y={24}>
          <div className="mt-12 border-t border-[#D7E2EA]/12 pt-8">
            <h3 className="mb-5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/40">
              Imagens criadas para
            </h3>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {brands.map((b) => (
                <li
                  key={b}
                  className="text-sm font-light uppercase tracking-wider text-[#D7E2EA]/80 sm:text-base"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} y={20}>
          <div className="mt-16 flex justify-center">
            <ContactButton />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
