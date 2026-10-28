import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** How far outside the element the effect starts reacting, in px. */
  padding?: number
  /** Higher value means a weaker pull. */
  strength?: number
  /** Maximum tilt on each axis, in degrees. Set to 0 for a flat translate. */
  tilt?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

/**
 * Follows the cursor: the element drifts toward it and tilts in 3D, as if
 * it were a card being turned to face the pointer.
 */
export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  tilt = 14,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ x: 0, y: 0, rx: 0, ry: 0 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    // Pointer response is decoration, not content. Skip it where it cannot
    // work or is unwanted.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduced || !fine) return

    let frame = 0

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy

        const withinX = Math.abs(dx) < rect.width / 2 + padding
        const withinY = Math.abs(dy) < rect.height / 2 + padding

        if (withinX && withinY) {
          // -1..1 across the reactive area, so tilt maxes out at the edges.
          const nx = Math.max(-1, Math.min(1, dx / (rect.width / 2 + padding)))
          const ny = Math.max(-1, Math.min(1, dy / (rect.height / 2 + padding)))
          setActive(true)
          setT({
            x: dx / strength,
            y: dy / strength,
            ry: nx * tilt,
            rx: -ny * tilt,
          })
        } else if (active) {
          setActive(false)
          setT({ x: 0, y: 0, rx: 0, ry: 0 })
        }
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
    }
  }, [padding, strength, tilt, active])

  return (
    <div ref={ref} className={className} style={{ perspective: '900px' }}>
      <div
        style={{
          transform: `translate3d(${t.x}px, ${t.y}px, 0) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transformStyle: 'preserve-3d',
          transition: active ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
