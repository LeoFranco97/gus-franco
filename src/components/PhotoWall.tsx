import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { heroWall, img } from '../data/site'
import type { WallPiece } from '../data/site'

/**
 * The hero picture well.
 *
 * Vertical columns of photographs, full bleed, at a constant slow speed in
 * alternating directions. Deliberately NOT tied to scroll: scroll-linked
 * motion stutters and reverses, which reads as a bug on a hero.
 *
 * Two things are computed from a live measurement of the container rather
 * than hardcoded, because both fail visibly as fixed numbers:
 *
 * 1. COLUMN COUNT. Fixed at three, a 1440px screen gives 476px cells, which
 *    makes each frame so large that only one shows per column. That reads as
 *    three big pictures, not as a body of work. The column count tracks a
 *    target cell width instead, so a cell stays around 300 to 380px at every
 *    size and the wall always shows eight to twelve frames at once.
 *
 * 2. REPEAT COUNT. A track needs enough copies of its frames that the loop
 *    never exposes empty space. Two copies only works while one set is taller
 *    than the window, which is not true for a short column on a tall screen.
 *    K is solved for instead: with K copies the track shifts by exactly one
 *    set (100/K percent), leaving (K-1) sets covering the window, so
 *    K = ceil(windowHeight / setHeight) + 1 can never leave a hole.
 *
 * The gutter is applied as margin inside each cell rather than as a flex gap.
 * With a flex gap the copies would differ by one gutter and the loop would
 * drift by a fraction of a gutter every cycle.
 */

/** Gutter, in px. Narrower than the marquee below on purpose. */
const GAP = 6

/** Corner radius, in px. Nearly square, so it reads editorial, not template. */
const RADIUS = 2

/** Cell width the layout aims for. Drives how many columns fit. */
const TARGET_CELL = 320

/** Scroll speed, px per second. Slow enough to read, fast enough to live. */
const SPEED = 54

const MIN_DURATION = 25
const MAX_DURATION = 40

/** Frames at these indices load eagerly: they are the first frame. */
const PRIORITY = 4

type Size = { w: number; h: number }

function initialSize(): Size {
  if (typeof window === 'undefined') return { w: 1440, h: 600 }
  // Rough first guess so the very first paint already carries images. The
  // layout effect below corrects it before the browser paints.
  return { w: window.innerWidth, h: Math.max(320, window.innerHeight * 0.58) }
}

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<Size>(initialSize)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const read = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (w > 0 && h > 0) {
        setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
      }
    }

    read()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, size }
}

/**
 * Pauses the animation whenever the hero is off screen, so a backgrounded
 * tab is not compositing several columns forever.
 */
function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setVisible(entries[0].isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  return visible
}

/** Snap to a 32px grid so a 15px scrollbar cannot flip the column count. */
const quantize = (v: number) => Math.round(v / 32) * 32

function columnCount(width: number, height: number) {
  if (width <= 0) return 4
  // Phones get two columns. A single band at field height shows about 60
  // percent of one frame on a 375px screen, which is a slideshow, not a wall.
  if (width < 768) return 2

  // Both inputs are quantized first. Without it the division sits on a knife
  // edge at 1440: with a scrollbar the measured width is 1425 and the wall
  // comes out at four 352px columns, without one it is 1440 and the wall
  // comes out at five 283px columns. Same laptop, two different heros.
  const w = quantize(width)
  const h = quantize(height)

  // On a short field (a 1280x720 laptop leaves the wall about 360px) the
  // width-based target alone gives cells so tall that barely one frame fits
  // per column. Capping the target against the field height gives short
  // screens more, narrower columns instead.
  const target = Math.max(160, Math.min(TARGET_CELL, h * 0.62))
  return Math.min(8, Math.max(3, Math.round(w / target)))
}

function Cell({ piece, index }: { piece: WallPiece; index: number }) {
  const eager = index < PRIORITY

  return (
    <div className="w-full" style={{ marginBottom: GAP }}>
      <img
        src={img(piece.src)}
        alt=""
        aria-hidden
        draggable={false}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        className="block h-auto w-full select-none bg-white/[0.04] object-cover"
        style={{ aspectRatio: String(piece.ratio), borderRadius: RADIUS }}
      />
    </div>
  )
}

export default function PhotoWall() {
  const { ref, size } = useMeasure<HTMLDivElement>()
  const visible = useOnScreen(ref)
  const playState = visible ? 'running' : 'paused'

  const cols = columnCount(size.w, size.h)
  const cellW = (size.w - (cols - 1) * GAP) / cols

  // Round robin, so frames 0, 1, 2, 3 land at the top of the first four
  // columns and the strongest work is always what the first frame shows,
  // whatever the column count turns out to be.
  const columns = Array.from({ length: cols }, (_, c) =>
    heroWall.filter((_, i) => i % cols === c),
  )

  return (
    <div ref={ref} className="flex h-full w-full overflow-hidden" style={{ gap: GAP }}>
      {columns.map((items, c) => {
        // Height of one full set, gutters included.
        const setH = items.reduce((acc, p) => acc + cellW / p.ratio + GAP, 0)
        const repeats = setH > 0 ? Math.max(2, Math.ceil(size.h / setH) + 1) : 2

        // Speed is eased down for narrow cells and never eased up. What the
        // eye reads is frames per second, not pixels per second: at the same
        // 54px/s a 185px phone cell flicks a frame past every three seconds,
        // which feels hurried, while a 313px desktop cell feels calm.
        const speed = SPEED * Math.min(1, cellW / 300)
        const raw = setH / speed
        const clamped = Math.min(MAX_DURATION, Math.max(MIN_DURATION, raw))
        // Small per-column stagger so the columns never march in step.
        const duration = Math.min(MAX_DURATION, clamped * (1 + (c % 4) * 0.06))

        const copies = Array.from({ length: repeats }, (_, k) => k)

        return (
          <div key={c} className="relative h-full min-w-0 flex-1 overflow-hidden">
            <div
              className="work-track absolute inset-x-0 top-0 will-change-transform"
              style={
                {
                  animationName: c % 2 === 1 ? 'wall-down' : 'wall-up',
                  animationDuration: `${duration.toFixed(2)}s`,
                  animationPlayState: playState,
                  '--shift': `${(-100 / repeats).toFixed(4)}%`,
                } as React.CSSProperties
              }
            >
              {copies.map((k) =>
                items.map((p) => (
                  <Cell key={`${k}-${p.src}`} piece={p} index={heroWall.indexOf(p)} />
                )),
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
