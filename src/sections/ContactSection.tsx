// lucide dropped its brand icons, so AtSign stands in for the social handle.
import { Mail, MessageCircle, AtSign, MapPin } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import { aboutTextEn, img, portrait, profile } from '../data/site'

const coverage = [
  { label: 'Base', value: 'São Paulo, Brasil. Atendo o Brasil inteiro.' },
  {
    label: 'Fora do país',
    value: 'Itália, Espanha, Portugal, Holanda, Tailândia, Islândia, Dubai, Uruguai e República Dominicana.',
  },
  { label: 'Agenda', value: 'Datas abertas para casamento, elopement e ensaio.' },
  { label: 'Idiomas', value: 'Português e inglês.' },
]

export default function ContactSection() {
  return (
    <section id="contato" className="bg-[#0C0C0C] px-5 pb-24 pt-10 sm:px-8 md:px-10 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading mb-12 text-center font-black uppercase leading-none tracking-tight sm:mb-16"
            style={{ fontSize: 'clamp(2.6rem, 11vw, 160px)' }}
          >
            Vamos criar
          </h2>
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <FadeIn delay={0.1} y={30}>
            <h3 className="mb-6 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/50">
              Onde eu fotografo
            </h3>
            <dl className="flex flex-col">
              {coverage.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 border-t border-[#D7E2EA]/15 py-4 sm:flex-row sm:gap-6"
                >
                  <dt className="w-32 shrink-0 text-sm font-medium uppercase tracking-wider text-[#D7E2EA]/60">
                    {row.label}
                  </dt>
                  <dd className="text-sm font-light leading-relaxed text-[#D7E2EA] sm:text-base">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* The English paragraph from his Sobre page, kept because a good
                share of the enquiries come from outside Brazil. */}
            <p className="mt-8 border-t border-[#D7E2EA]/15 pt-6 text-sm font-light italic leading-relaxed text-[#D7E2EA]/55">
              {aboutTextEn}
            </p>
          </FadeIn>

          <FadeIn delay={0.2} y={30}>
            <h3 className="mb-6 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/50">
              Contato
            </h3>

            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 text-[#D7E2EA] transition-opacity hover:opacity-70"
              >
                <Mail size={18} strokeWidth={1.5} />
                <span className="text-sm font-light sm:text-base">{profile.email}</span>
              </a>
              <a
                href={profile.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[#D7E2EA] transition-opacity hover:opacity-70"
              >
                <MessageCircle size={18} strokeWidth={1.5} />
                <span className="text-sm font-light sm:text-base">{profile.whatsapp}</span>
              </a>
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[#D7E2EA] transition-opacity hover:opacity-70"
              >
                <AtSign size={18} strokeWidth={1.5} />
                <span className="text-sm font-light sm:text-base">
                  {profile.instagramHandle}
                  <span className="text-[#D7E2EA]/40"> · fotografia</span>
                </span>
              </a>
              <a
                href={profile.instagramAlt}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[#D7E2EA] transition-opacity hover:opacity-70"
              >
                <AtSign size={18} strokeWidth={1.5} />
                <span className="text-sm font-light sm:text-base">
                  {profile.instagramAltHandle}
                  <span className="text-[#D7E2EA]/40"> · flash e rua</span>
                </span>
              </a>
              <p className="flex items-center gap-3 text-[#D7E2EA]/70">
                <MapPin size={18} strokeWidth={1.5} />
                <span className="text-sm font-light sm:text-base">{profile.location}</span>
              </p>
            </div>

            <div className="mt-10 flex items-center gap-5 border-t border-[#D7E2EA]/15 pt-8">
              <img
                src={img(portrait)}
                alt={profile.fullName}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-[#D7E2EA]/20"
              />
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-[#D7E2EA]">
                  {profile.fullName}
                </p>
                <p className="mt-1 text-xs font-light uppercase tracking-widest text-[#D7E2EA]/40">
                  {profile.role}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} y={20}>
          <p className="mt-16 border-t border-[#D7E2EA]/15 pt-8 text-center text-[0.65rem] font-light uppercase tracking-widest text-[#D7E2EA]/30">
            {profile.fullName} · {profile.brand} · Todas as imagens são de autoria do fotógrafo
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
