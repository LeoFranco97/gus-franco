import { useEffect, useRef, useState } from 'react'
import { img, marqueeRowOne, marqueeRowTwo } from '../data/site'

function Row({
  images,
  direction,
  offset,
}: {
  images: readonly string[]
  direction: 1 | -1
  offset: number
}) {
  // Tripled so the strip never runs out of content while translating.
  const tripled = [...images, ...images, ...images]

  return (
    <div
      className="flex gap-3"
      style={{
        transform: `translateX(${direction * (offset - 200)}px)`,
        willChange: 'transform',
      }}
    >
      {tripled.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="h-[180px] w-[280px] shrink-0 overflow-hidden rounded-2xl bg-white/5 sm:h-[220px] sm:w-[340px] md:h-[270px] md:w-[420px]"
        >
          <img
            src={img(src)}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

/**
 * Two counter-running strips under the hero, one frame per story, nudged by
 * scroll position. Top padding is deliberately short: the hero already ends
 * on a scrim that is close to solid black for its last few hundred pixels,
 * so a tall pad here would produce a dead band between two picture fields.
 */
export default function MarqueeSection() {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let frame = 0

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY
        setOffset((window.scrollY - top + window.innerHeight) * 0.3)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section
      ref={ref}
      aria-label="Trabalhos selecionados"
      className="flex flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-16 sm:pt-20 md:pt-24"
    >
      <Row images={marqueeRowOne} direction={1} offset={offset} />
      <Row images={marqueeRowTwo} direction={-1} offset={offset} />
    </section>
  )
}
