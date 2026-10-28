import FadeIn from '../components/FadeIn'
import { services } from '../data/site'

/** What Gus shoots, as a numbered list rather than a grid of cards. */
export default function ServicesSection() {
  return (
    <section id="servicos" className="bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            O que eu faço
          </h2>
        </FadeIn>

        <ul className="mt-12 sm:mt-16">
          {services.map((s, i) => (
            <FadeIn key={s.n} delay={0.04 * i} y={24}>
              <li className="grid gap-2 border-t border-[#D7E2EA]/15 py-7 md:grid-cols-[4rem_minmax(0,16rem)_minmax(0,1fr)] md:items-baseline md:gap-8">
                <span className="text-xs font-light tracking-widest text-[#D7E2EA]/35">
                  {s.n}
                </span>
                <h3 className="text-lg font-medium uppercase tracking-wide text-[#D7E2EA] sm:text-xl">
                  {s.name}
                </h3>
                <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/60 sm:text-base">
                  {s.desc}
                </p>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  )
}
