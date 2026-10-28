import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

type Props = {
  text: string
  className?: string
  style?: React.CSSProperties
}

/** One character that brightens as the paragraph moves through the viewport. */
function Char({
  char,
  range,
  progress,
}: {
  char: string
  range: [number, number]
  progress: MotionValue<number>
}) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span className="relative inline-block whitespace-pre">
      <span className="opacity-20">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char}
      </motion.span>
    </span>
  )
}

/** Scroll-driven, character-by-character reveal. */
export default function AnimatedText({ text, className, style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const words = text.split(' ')
  let charIndex = 0
  const total = text.length

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, w) => {
        // Keep whole words together so they never break mid-word on wrap.
        const chars = (word + (w < words.length - 1 ? ' ' : '')).split('')
        return (
          <span key={w} className="inline-block whitespace-pre">
            {chars.map((char, c) => {
              const start = charIndex / total
              const end = (charIndex + 1) / total
              charIndex += 1
              return <Char key={c} char={char} range={[start, end]} progress={scrollYProgress} />
            })}
          </span>
        )
      })}
    </p>
  )
}
