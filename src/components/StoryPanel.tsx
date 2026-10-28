import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ExternalLink } from 'lucide-react'
import { img, loadStory } from '../data/site'
import type { Photo, StoryFull, StorySummary } from '../data/site'
import { useLightbox } from './Lightbox'

/**
 * One story, opened over the page: the words Gus published with it, then
 * every frame of the edit.
 *
 * The grid is shortest-column packing rather than CSS multicol. With
 * `columns: 3` a 128-frame essay fills the whole first column before it
 * starts the second, so the reading order of the edit is destroyed. Packing
 * each frame into whichever column is currently shortest keeps the sequence
 * running left to right and still leaves no ragged gaps.
 *
 * Column heights are accumulated from the stored width and height of each
 * file, so the layout is final on the first paint and nothing reflows as the
 * images arrive.
 */

function columnsFor(width: number) {
  if (width < 560) return 1
  if (width < 900) return 2
  if (width < 1400) return 3
  return 4
}

function pack(photos: Photo[], cols: number) {
  const buckets: { photo: Photo; i: number }[][] = Array.from({ length: cols }, () => [])
  const heights = new Array(cols).fill(0)
  photos.forEach((photo, i) => {
    let c = 0
    for (let k = 1; k < cols; k++) if (heights[k] < heights[c]) c = k
    buckets[c].push({ photo, i })
    // Unit width, so height is just the inverse aspect ratio.
    heights[c] += photo.h / photo.w
  })
  return buckets
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1200 : window.innerWidth))
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const read = () => setW((p) => (el.clientWidth > 0 && el.clientWidth !== p ? el.clientWidth : p))
    read()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, w }
}

export default function StoryPanel({
  story,
  close,
}: {
  story: StorySummary
  close: () => void
}) {
  const [full, setFull] = useState<StoryFull | null>(null)
  const [failed, setFailed] = useState(false)
  const { open } = useLightbox()
  const { ref, w } = useWidth<HTMLDivElement>()

  useEffect(() => {
    let live = true
    setFailed(false)
    loadStory(story.id).then(
      (d) => live && setFull(d),
      () => live && setFailed(true),
    )
    return () => {
      live = false
    }
  }, [story.id])

  // Lock the page behind the panel and close on Escape.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [close])

  const photos = full?.photos ?? []
  const cols = columnsFor(w)
  const buckets = pack(photos, cols)

  /*
   * On many posts the SEO description Gus wrote is the opening paragraph of
   * the post itself, so printing both puts the same sentence on screen twice,
   * once in the header and once at the top of the body. Drop a body paragraph
   * that opens the same way as the subtitle already shown above.
   */
  const head = (s: string) => s.replace(/\s+/g, ' ').trim().slice(0, 60).toLowerCase()
  const texts = (full?.texts ?? []).filter(
    (t) => !story.subtitle || head(t) !== head(story.subtitle),
  )

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={story.title}
      className="fixed inset-0 z-[110] flex flex-col bg-[#0C0C0C]"
      style={{ animation: 'sp-fade 0.25s ease-out' }}
    >
      <style>{`@keyframes sp-fade{from{opacity:0}to{opacity:1}}`}</style>

      {/* Sticky header, so the way out is always on screen in a 128-frame
          essay. */}
      <div className="flex shrink-0 items-start justify-between gap-5 border-b border-[#D7E2EA]/10 bg-[#0C0C0C] px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="truncate text-base font-medium uppercase tracking-wide text-[#D7E2EA] sm:text-xl">
              {story.title}
            </h2>
            <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/45">
              {story.count} fotos
            </span>
          </div>
          {(story.subtitle || story.published) && (
            <p className="mt-1 line-clamp-2 max-w-3xl text-xs font-light text-[#D7E2EA]/50 sm:text-sm">
              {[story.published, story.subtitle].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <button
          onClick={close}
          aria-label="Fechar"
          className="shrink-0 rounded-full border border-[#D7E2EA]/25 p-2 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* Body */}
      <div ref={ref} className="thin-scroll min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-6">
        {!full && !failed && (
          <p className="py-20 text-center text-sm font-light uppercase tracking-widest text-[#D7E2EA]/40">
            Carregando as fotos
          </p>
        )}

        {failed && (
          <p className="py-20 text-center text-sm font-light text-[#D7E2EA]/60">
            Não foi possível carregar esta história.{' '}
            <button
              onClick={() => {
                setFailed(false)
                loadStory(story.id).then(setFull, () => setFailed(true))
              }}
              className="underline underline-offset-4 hover:text-[#D7E2EA]"
            >
              Tentar de novo
            </button>
          </p>
        )}

        {full && (
          <>
            {texts.length > 0 && (
              <div className="mx-auto mb-10 max-w-2xl px-2">
                {texts.slice(0, 3).map((t, i) => (
                  <p
                    key={i}
                    className="mb-4 whitespace-pre-line text-sm font-light leading-relaxed text-[#D7E2EA]/70 sm:text-base"
                  >
                    {t}
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2 sm:gap-3">
              {buckets.map((bucket, c) => (
                <div key={c} className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
                  {bucket.map(({ photo, i }) => (
                    <button
                      key={photo.full}
                      onClick={() => open(photos, story.title, i)}
                      className="group relative block w-full overflow-hidden rounded-sm bg-white/[0.04]"
                      style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
                      aria-label={photo.cap || `Abrir foto ${i + 1}`}
                    >
                      <img
                        src={img(photo.mid)}
                        alt={photo.alt || ''}
                        loading={i < cols * 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      {photo.cap && (
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 text-left text-[0.65rem] font-light leading-snug text-[#D7E2EA] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-xs">
                          {photo.cap}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* The rest of the words, after the frames, so a long caption
                block never stands between the reader and the pictures. */}
            {texts.length > 3 && (
              <div className="mx-auto mt-12 max-w-2xl border-t border-[#D7E2EA]/10 px-2 pt-8">
                {texts.slice(3).map((t, i) => (
                  <p
                    key={i}
                    className="mb-4 whitespace-pre-line text-sm font-light leading-relaxed text-[#D7E2EA]/60"
                  >
                    {t}
                  </p>
                ))}
              </div>
            )}

            <div className="mx-auto mt-12 flex max-w-2xl justify-center px-2 pb-4">
              <a
                href={full.source}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-light uppercase tracking-widest text-[#D7E2EA]/40 transition-colors hover:text-[#D7E2EA]"
              >
                Ver no site original
                <ExternalLink size={13} strokeWidth={1.5} />
              </a>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
