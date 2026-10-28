import Magnet from './Magnet'

type ContactProps = {
  href?: string
  label?: string
  className?: string
}

/**
 * Warm gradient pill, the primary call to action.
 *
 * The palette is pulled off the work itself: the amber of the Jericoacoara
 * dunes into the deep teal of the Iceland frames, which is the tonal range
 * the photography actually lives in. A magnetic pull on the button is an
 * understood affordance and this is a real target. Flat pull, no tilt,
 * because a pill sheared in perspective reads as a glitch.
 */
export function ContactButton({
  href = '#contato',
  label = 'Fale comigo',
  className = '',
}: ContactProps) {
  return (
    <Magnet className="inline-block" padding={70} strength={5} tilt={0}>
      <a
        href={href}
        className={`inline-block shrink-0 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-105 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
        style={{
          background:
            'linear-gradient(123deg, #1A1208 7%, #C2763A 37%, #8C5A2B 70%, #2E4A52 100%)',
          boxShadow: '0px 4px 4px rgba(194, 118, 58, 0.25), 4px 4px 12px #8C5A2B inset',
          outline: '2px solid #fff',
          outlineOffset: '-3px',
        }}
      >
        {label}
      </a>
    </Magnet>
  )
}

type GhostProps = {
  href?: string
  label?: string
  className?: string
  onClick?: () => void
}

/** Outline pill, the secondary action. */
export function GhostButton({ href, label = 'Ver', className = '', onClick }: GhostProps) {
  const cls = `inline-block shrink-0 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base ${className}`

  if (onClick || !href) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {label}
      </button>
    )
  }

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className={cls}
    >
      {label}
    </a>
  )
}
