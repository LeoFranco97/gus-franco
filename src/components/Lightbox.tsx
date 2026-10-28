import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { img } from '../data/site'
import type { Photo } from '../data/site'

type State = { photos: Photo[]; title: string; index: number } | null

type Api = { open: (photos: Photo[], title: string, index?: number) => void }

const LightboxContext = createContext<Api>({ open: () => {} })

/** Call `open(photos, title, index)` to show a set of frames full screen. */
export const useLightbox = () => useContext(LightboxContext)

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(null)

  const open = useCallback((photos: Photo[], title: string, index = 0) => {
    if (photos.length) setState({ photos, title, index })
  }, [])
  const close = useCallback(() => setState(null), [])
  const go = useCallback(
    (delta: number) =>
      setState((s) =>
        s ? { ...s, index: (s.index + delta + s.photos.length) % s.photos.length } : s,
      ),
    [],
  )
  const jump = useCallback(
    (index: number) => setState((s) => (s ? { ...s, index } : s)),
    [],
  )

  // Lock scroll and wire up keyboard control while open.
  useEffect(() => {
    if (!state) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [state, close, go])

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {state && createPortal(<View state={state} close={close} go={go} jump={jump} />, document.body)}
    </LightboxContext.Provider>
  )
}

/** The EXIF line. Omitted entirely when the file carries no camera data. */
function Exif({ exif }: { exif?: Record<string, string> }) {
  if (!exif) return null
  const parts = [
    exif.CameraModel,
    exif.Lens,
    exif.FocalLength,
    exif.Aperture && `f/${exif.Aperture}`,
    exif.ShutterSpeed && `${exif.ShutterSpeed}s`,
    exif.ISO && `ISO ${exif.ISO}`,
  ].filter(Boolean)
  if (!parts.length) return null
  return (
    <span className="font-light tracking-wider text-[#D7E2EA]/35">{parts.join(' · ')}</span>
  )
}

function View({
  state,
  close,
  go,
  jump,
}: {
  state: NonNullable<State>
  close: () => void
  go: (d: number) => void
  jump: (i: number) => void
}) {
  const { photos, index } = state
  const many = photos.length > 1
  const photo = photos[index]

  /*
   * Thumbnail strip, windowed.
   *
   * A full strip was fine for a 12-page deck and is not fine here: the
   * longest essay runs to 128 frames, which is 128 requests and a strip
   * several screens wide that the arrow keys scroll past invisibly. Only a
   * window around the current frame is mounted, and the window is a fixed
   * width so the current thumbnail stays near the middle instead of sliding.
   */
  const win = useMemo(() => {
    const SPAN = 9
    const half = Math.floor(SPAN / 2)
    let start = index - half
    start = Math.max(0, Math.min(start, photos.length - SPAN))
    start = Math.max(0, start)
    return photos.slice(start, start + SPAN).map((p, i) => ({ p, i: start + i }))
  }, [index, photos])

  /*
   * Preload the neighbours. Paging through a wedding essay one frame at a
   * time is the main interaction here, and without this every press waits on
   * a cold request.
   */
  useEffect(() => {
    for (const d of [1, -1, 2]) {
      const n = photos[(index + d + photos.length) % photos.length]
      if (!n) continue
      const im = new Image()
      im.src = img(n.full)
    }
  }, [index, photos])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={state.title}
      onClick={close}
      className="fixed inset-0 z-[120] flex flex-col bg-[#0C0C0C]"
      style={{ animation: 'lb-fade 0.2s ease-out' }}
    >
      <style>{`@keyframes lb-fade{from{opacity:0}to{opacity:1}}`}</style>

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="truncate text-sm font-medium uppercase tracking-widest text-[#D7E2EA] sm:text-base">
            {state.title}
          </span>
          {many && (
            <span className="shrink-0 text-xs font-light tracking-wider text-[#D7E2EA]/50">
              {index + 1} / {photos.length}
            </span>
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

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 sm:px-16">
        {many && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#D7E2EA]/25 bg-[#0C0C0C]/60 p-2.5 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 sm:left-5"
          >
            <ChevronLeft size={22} strokeWidth={1.75} />
          </button>
        )}

        <img
          key={img(photo.full)}
          src={img(photo.full)}
          alt={photo.alt || photo.cap || state.title}
          onClick={(e) => e.stopPropagation()}
          width={photo.w}
          height={photo.h}
          className="max-h-full w-auto max-w-full rounded-sm object-contain shadow-2xl"
          style={{ animation: 'lb-fade 0.25s ease-out' }}
        />

        {many && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            aria-label="Próxima"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#D7E2EA]/25 bg-[#0C0C0C]/60 p-2.5 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 sm:right-5"
          >
            <ChevronRight size={22} strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Caption and camera data */}
      {(photo.cap || photo.exif) && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 px-5 pt-3 text-center sm:px-8"
        >
          {photo.cap && (
            <p className="text-xs font-light leading-relaxed text-[#D7E2EA]/70 sm:text-sm">
              {photo.cap}
            </p>
          )}
          <p className="mt-1 text-[0.6rem] sm:text-[0.65rem]">
            <Exif exif={photo.exif} />
          </p>
        </div>
      )}

      {/* Thumbnails */}
      {many && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex shrink-0 justify-center gap-2 px-4 pb-5 pt-3"
        >
          {win.map(({ p, i }) => (
            <button
              key={p.thumb}
              onClick={() => jump(i)}
              aria-label={`Foto ${i + 1}`}
              aria-current={i === index}
              className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border transition-opacity sm:h-14 sm:w-20 ${
                i === index
                  ? 'border-[#D7E2EA] opacity-100'
                  : 'border-transparent opacity-40 hover:opacity-80'
              }`}
            >
              <img
                src={img(p.thumb)}
                alt=""
                className="h-full w-full bg-white/5 object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
