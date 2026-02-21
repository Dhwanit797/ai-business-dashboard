import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react'

export default function SectionProductPreview() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0.15, 0.5], [80, -50])
  const scale = useTransform(scrollYProgress, [0.1, 0.35], [0.94, 1])
  const opacity = useTransform(scrollYProgress, [0.08, 0.28], [0.5, 1])

  return (
    <section id="product" ref={ref} className="relative overflow-hidden bg-ds-bg-base py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 35%, rgb(var(--ds-accent) / 0.12) 0%, transparent 55%)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          className="text-sm font-semibold uppercase tracking-wider text-ds-accent"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Product
        </motion.p>
        <motion.h2
          className="mt-3 text-3xl font-bold text-ds-text-primary md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          Your command center for business intelligence
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-xl text-lg text-ds-text-secondary"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          One dashboard. All your metrics. Real-time decisions.
        </motion.p>
      </div>

      <motion.div
        style={{ y, scale, opacity }}
        className="relative z-10 mx-auto mt-14 max-w-4xl px-6"
      >
        {/* Soft glow behind mockup */}
        <div
          className="absolute inset-0 -bottom-8 scale-95 rounded-3xl opacity-60 blur-2xl"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgb(var(--ds-accent) / 0.15), transparent 70%)',
          }}
        />
        <div
          className="relative overflow-hidden rounded-2xl bg-ds-bg-surface shadow-2xl dark:bg-ds-bg-elevated"
          style={{
            boxShadow: '0 25px 60px -12px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(var(--ds-text-muted) / 0.08)',
          }}
        >
          <div className="flex items-center gap-2 border-b border-ds-bg-base/50 px-6 py-4 dark:border-white/5">
            <div className="h-2 w-2 rounded-full bg-ds-accent-danger" />
            <div className="h-2 w-2 rounded-full bg-ds-accent-warning" />
            <div className="h-2 w-2 rounded-full bg-ds-accent-success" />
            <span className="ml-4 text-sm text-ds-text-muted">Dashboard</span>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            {[
              { label: 'Revenue', value: '$124.2k', change: '+12%', icon: DollarSign },
              { label: 'Expenses', value: '$48.1k', change: '-5%', icon: BarChart3 },
              { label: 'Health', value: '94', change: '+2', icon: TrendingUp },
            ].map(({ label, value, change, icon: Icon }) => (
              <div key={label} className="rounded-xl bg-ds-bg-base/50 p-4 dark:bg-ds-bg-base/40">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ds-text-secondary">{label}</span>
                  <Icon className="h-4 w-4 text-ds-accent" />
                </div>
                <p className="mt-2 text-xl font-bold text-ds-text-primary">{value}</p>
                <p className="text-sm text-ds-accent-success">{change}</p>
              </div>
            ))}
          </div>
          <div className="h-48 bg-ds-bg-base/30 dark:bg-ds-bg-base/20" />
        </div>

        {/* Floating metric chips */}
        {[
          { label: 'Fraud risk', value: 'Low', top: '20%', right: '-2%', x: 20, delay: 0.4 },
          { label: 'Inventory', value: 'Optimal', top: '48%', left: '-3%', x: -20, delay: 0.5 },
          { label: 'AI Score', value: '98%', bottom: '18%', right: '5%', x: 15, delay: 0.6 },
        ].map(({ label, value, top, left, right, bottom, x, delay }) => (
          <motion.div
            key={label}
            className="absolute rounded-xl border border-ds-text-muted/20 bg-ds-bg-surface px-4 py-2.5 shadow-ds-surface dark:border-white/10"
            style={{ top: top ?? undefined, left: left ?? undefined, right: right ?? undefined, bottom: bottom ?? undefined }}
            initial={{ opacity: 0, x }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
          >
            <p className="text-xs text-ds-text-muted">{label}</p>
            <p className="text-base font-semibold text-ds-text-primary">{value}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
