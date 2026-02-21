import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

type PrimaryProps = { to: string; children: React.ReactNode }

export function HeroPrimaryButton({ to, children }: PrimaryProps) {
  return (
    <Link to={to} className="group relative inline-block">
      {/* Outer glow ring (blurred) */}
      <span
        className="absolute -inset-1 rounded-xl opacity-70 blur-md transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(135deg, rgb(var(--ds-accent)), rgb(var(--ds-accent-teal)))',
        }}
        aria-hidden
      />
      {/* Gradient border wrapper (1px) */}
      <span
        className="absolute inset-0 rounded-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: '1px',
          background: 'linear-gradient(135deg, rgb(var(--ds-accent)), rgb(var(--ds-accent-teal)))',
          opacity: 0.9,
        }}
        aria-hidden
      >
        <span className="block h-full w-full rounded-[11px] bg-ds-bg-base" />
      </span>
      <motion.span
        className="relative flex items-center justify-center rounded-[11px] bg-ds-accent px-8 py-3.5 font-semibold text-ds-text-inverse"
        style={{ boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.12)' }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      >
        <span
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[11px]"
          aria-hidden
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" style={{ width: '70%' }} />
        </span>
        <span className="relative">{children}</span>
      </motion.span>
    </Link>
  )
}

type SecondaryProps = { href: string; children: React.ReactNode }

export function HeroSecondaryButton({ href, children }: SecondaryProps) {
  return (
    <a href={href} className="group relative inline-block rounded-xl">
      <span
        className="absolute inset-0 rounded-xl bg-ds-bg-surface/90 shadow-ds-card backdrop-blur-sm transition-all duration-300 group-hover:bg-ds-bg-surface"
        aria-hidden
      />
      <span
        className="absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[hero-border-shimmer_2.5s_ease-in-out]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgb(var(--ds-accent) / 0.4), rgb(var(--ds-accent-teal) / 0.35), transparent)',
          backgroundSize: '200% 100%',
        }}
        aria-hidden
      />
      <span
        className="absolute inset-0 rounded-xl border border-ds-text-muted/25 transition-colors duration-300 group-hover:border-ds-accent/40"
        aria-hidden
      />
      <motion.span
        className="relative flex items-center justify-center px-8 py-3.5 font-semibold text-ds-text-primary"
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      >
        {children}
      </motion.span>
    </a>
  )
}
