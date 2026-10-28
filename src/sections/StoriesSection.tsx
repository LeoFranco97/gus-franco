import { useMemo, useState } from 'react'
import FadeIn from '../components/FadeIn'
import StoryPanel from '../components/StoryPanel'
import { img, stories, totalPhotos } from '../data/site'
import type { StorySummary } from '../data/site'

/**
 * The body of work: every story, every frame.
 *
 * A card is a cover plus a four-frame strip taken at even intervals through
 * the edit, so the strip shows the range of a story rather than four frames
 * of the same moment. Opening a card loads that story's photo list on demand
 * (see loadStory) and shows the whole edit in StoryPanel.
 *
 * The filter runs on a hand-assigned group rather than on the tags from the
 * old site: those were a mix of years, places and loose keywords ("2017",
 * "beach", "Thapae loft"), which is a tag cloud, not a way to navigate.
 */

/** Order is editorial: the jobs a client is shopping for come first. */
const GROUPS = [
  'Todas',
  'Casamento',
  'Elopement',
  'Destination Wedding',
  'Ensaio',
  'Retrato e Documentário',
  'Diário',
] as const

function Card({ story, onOpen }: { story: StorySummary; onOpen: () => void }) {
  // The cover is already the first frame of the preview, so the strip under
  // it starts at the second.
  const strip = story.preview.slice(1, 5)

  return (
    <button
      onClick={onOpen}
      className="group block w-full text-left"
      aria-label={`Abrir ${story.title}, ${story.count} fotos`}
    >
      <div className="relative overflow-hidden rounded-sm bg-white/[0.04]" style={{ aspectRatio: '4 / 3' }}>
        <img
          src={img(story.cover.mid)}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-widest text-[#D7E2EA] backdrop-blur-sm">
          {story.group}
        </span>
        <span className="pointer-events-none absolute bottom-4 right-4 text-[0.65rem] font-light uppercase tracking-widest text-[#D7E2EA]/85">
          {story.count} fotos
        </span>
      </div>

      {/* Range strip. Hidden below sm, where four 60px thumbnails read as
          noise rather than as a preview. */}
      {strip.length > 0 && (
        <div className="mt-1.5 hidden gap-1.5 sm:flex">
          {strip.map((p) => (
            <span
              key={p.thumb}
              className="block min-w-0 flex-1 overflow-hidden rounded-sm bg-white/[0.04]"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src={img(p.thumb)}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
          ))}
        </div>
      )}

      <h3 className="mt-3 text-sm font-medium uppercase leading-snug tracking-wide text-[#D7E2EA] transition-colors group-hover:text-white sm:text-base">
        {story.title}
      </h3>
      <p className="mt-0.5 text-xs font-light text-[#D7E2EA]/45 sm:text-sm">
        {[story.place, story.published].filter(Boolean).join(' · ')}
      </p>
    </button>
  )
}

export default function StoriesSection() {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>('Todas')
  const [openStory, setOpenStory] = useState<StorySummary | null>(null)

  const shown = useMemo(
    () => (group === 'Todas' ? stories : stories.filter((s) => s.group === group)),
    [group],
  )

  const shownPhotos = shown.reduce((n, s) => n + s.count, 0)

  return (
    <section id="historias" className="bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Histórias
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} y={20}>
          <p className="mx-auto mt-5 max-w-xl text-center text-sm font-light leading-relaxed text-[#D7E2EA]/55 sm:text-base">
            {stories.length} histórias completas e {totalPhotos} fotografias. Clique em qualquer
            uma para ver o ensaio inteiro.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} y={20}>
          <div
            role="tablist"
            aria-label="Filtrar histórias"
            className="mt-10 flex flex-wrap justify-center gap-2 sm:mt-12"
          >
            {GROUPS.map((g) => {
              const active = g === group
              return (
                <button
                  key={g}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setGroup(g)}
                  className={`rounded-full border px-4 py-2 text-[0.65rem] font-medium uppercase tracking-widest transition-colors sm:text-xs ${
                    active
                      ? 'border-[#D7E2EA] bg-[#D7E2EA] text-[#0C0C0C]'
                      : 'border-[#D7E2EA]/25 text-[#D7E2EA]/70 hover:border-[#D7E2EA]/60 hover:text-[#D7E2EA]'
                  }`}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </FadeIn>

        <p className="mt-5 text-center text-[0.65rem] font-light uppercase tracking-widest text-[#D7E2EA]/35">
          {shown.length} {shown.length === 1 ? 'história' : 'histórias'} · {shownPhotos} fotos
        </p>

        <div className="mt-8 grid gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {shown.map((s, i) => (
            // The reveal delay is capped so the last cards of a 36-card grid
            // are not still fading in a second and a half after the first.
            <FadeIn key={s.id} delay={Math.min(0.3, 0.04 * (i % 6))} y={30}>
              <Card story={s} onOpen={() => setOpenStory(s)} />
            </FadeIn>
          ))}
        </div>
      </div>

      {openStory && <StoryPanel story={openStory} close={() => setOpenStory(null)} />}
    </section>
  )
}
