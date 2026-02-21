import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { HeroPrimaryButton, HeroSecondaryButton } from './HeroCTAButtons'
import Hero3D from '../Hero3D'

const stagger = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function HeroSection() {
  const { token, isValid } = useAuth()
  const { theme } = useTheme()
  const isLoggedIn = !!token && isValid
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 0.4], [0, 40])
  const y3d = useTransform(scrollYProgress, [0, 0.4], [0, -30])
  const opacity3d = useTransform(scrollYProgress, [0.2, 0.5], [1, 0.3])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-ds-bg-base lg:flex-row lg:items-center"
      style={{ minHeight: '90vh' }}
    >
      {/* Background layer: z-0, pointer-events-none so it never blocks content */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-100" style={{ background: 'var(--ds-hero-glow)' }} />
        <div className="absolute inset-0 opacity-100" style={{ background: 'var(--ds-hero-ambient)' }} />
        <div
          className="absolute inset-0 opacity-100"
          style={{ background: 'var(--ds-hero-vignette)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content layer: z-10 so text and 3D sit above background */}
      <motion.div
        style={{ y: yText }}
        className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 lg:w-[55%] lg:max-w-none lg:px-14 lg:py-24 xl:px-20"
      >
        {/* Floating blur accent behind headline (theme-aware) */}
        <div
          className="pointer-events-none absolute left-0 top-1/3 h-64 w-96 -translate-y-1/2 rounded-full opacity-30 blur-[100px] dark:opacity-20"
          style={{
            background: 'var(--ds-gradient-accent)',
            filter: 'blur(80px)',
          }}
        />

        <motion.p
          className="relative text-xs font-semibold uppercase tracking-[0.25em] text-ds-accent"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Business Intelligence Platform
        </motion.p>

        <motion.h1
          className="relative mt-5 text-4xl font-bold leading-[1.15] text-ds-text-primary sm:text-5xl md:text-5xl lg:text-6xl xl:text-[3.5rem]"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        >
          <motion.span variants={stagger} custom={0} className="block">
            AI That Thinks Like Your{' '}
            <span className="bg-gradient-to-r from-[rgb(var(--ds-accent))] to-[rgb(var(--ds-accent-teal))] bg-clip-text text-transparent">
              CFO.
            </span>
          </motion.span>
        </motion.h1>

        <motion.p
          className="relative mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-2xl font-semibold tracking-tight text-ds-text-primary sm:text-3xl lg:text-[1.75rem]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="relative inline-block">
            Predict.
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 w-full bg-ds-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{ transformOrigin: 'left' }}
            />
          </span>
          <span className="relative inline-block">
            Detect.
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 w-full bg-ds-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ transformOrigin: 'left' }}
            />
          </span>
          <span className="relative inline-block">
            Optimize.
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 w-full bg-ds-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{ transformOrigin: 'left' }}
            />
          </span>
        </motion.p>

        <motion.p
          className="relative mt-6 max-w-xl text-lg leading-relaxed text-ds-text-secondary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Expenses, fraud detection, inventory forecasting, and sustainability analytics unified in
          one AI engine.
        </motion.p>

        <motion.div
          className="relative mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <HeroPrimaryButton to={isLoggedIn ? '/dashboard' : '/login'}>
            Enter Dashboard
          </HeroPrimaryButton>
          <HeroSecondaryButton href="#features">
            See How It Works
          </HeroSecondaryButton>
        </motion.div>

        {/* Trust line + minimal badges */}
        <motion.p
          className="relative mt-8 text-sm text-ds-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Trusted by modern startups & AI-driven teams
        </motion.p>
        <motion.div
          className="relative mt-3 flex flex-wrap items-center gap-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {['Analytics', 'Finance', 'Operations'].map((label, i) => (
            <span
              key={label}
              className="rounded-lg bg-ds-bg-surface/80 px-3 py-1.5 text-xs font-medium text-ds-text-secondary shadow-sm dark:bg-ds-bg-surface/60"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Right column: 45% — 3D (z-10 same as content so it stays in content layer) */}
      <motion.div
        style={{ y: y3d, opacity: opacity3d }}
        className="relative z-10 flex h-[45vh] flex-1 lg:h-[90vh] lg:w-[45%]"
      >
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Hero3D theme={theme} />
        </motion.div>
      </motion.div>
    </section>
  )
}
