import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function SectionCTA() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const beamX = useTransform(scrollYProgress, [0.3, 0.7], ['-20%', '120%'])
  const { token, isValid } = useAuth()
  const isLoggedIn = !!token && isValid

  return (
    <section ref={ref} className="relative overflow-hidden bg-ds-bg-base py-24 md:py-32">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: 'linear-gradient(160deg, rgb(var(--ds-bg-elevated)) 0%, rgb(var(--ds-bg-base)) 35%, rgb(var(--ds-bg-elevated)) 70%, rgb(var(--ds-bg-base)) 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 40%, rgb(var(--ds-accent) / 0.1) 0%, transparent 55%)',
        }}
      />
      {/* Moving light beam */}
      <motion.div
        className="pointer-events-none absolute inset-0 top-1/2 h-64 w-[40%] -translate-y-1/2 opacity-30 blur-[40px]"
        style={{
          x: beamX,
          background: 'linear-gradient(90deg, transparent, rgb(var(--ds-accent) / 0.15), transparent)',
        }}
      />
      {/* Soft floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-ds-accent"
            style={{
              left: `${15 + i * 7}%`,
              top: `${20 + (i % 5) * 18}%`,
              opacity: 0.15 + (i % 3) * 0.08,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-ds-text-primary md:text-4xl lg:text-5xl">
          Ready to run smarter?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ds-text-secondary">
          Join teams that use Business AI to see clearer, act faster, and stay ahead of risk.
        </p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <Link
            to={isLoggedIn ? '/dashboard' : '/login'}
            className="group relative inline-block rounded-xl"
          >
            <span
              className="absolute -inset-[1px] rounded-xl opacity-80 transition-opacity group-hover:opacity-100"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--ds-accent)), rgb(var(--ds-accent-teal)))',
                filter: 'blur(6px)',
              }}
              aria-hidden
            />
            <span
              className="absolute inset-0 rounded-xl border border-white/20"
              style={{ boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.1)' }}
              aria-hidden
            />
            <motion.span
              className="relative flex items-center justify-center rounded-xl bg-ds-accent px-10 py-4 font-semibold text-ds-text-inverse"
              style={{ boxShadow: '0 4px 24px rgb(var(--ds-accent) / 0.35)' }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoggedIn ? 'Open dashboard' : 'Get started free'}
            </motion.span>
          </Link>
        </motion.div>
        <p className="mt-6 text-sm text-ds-text-muted">
          No credit card required. Start in minutes.
        </p>
      </motion.div>
    </section>
  )
}
