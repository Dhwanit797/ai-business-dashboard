import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Receipt, Shield, Package, Leaf } from 'lucide-react'
import { TrendingUp, Zap, BarChart3 } from 'lucide-react'

const VALUE_HIGHLIGHTS = [
  {
    icon: TrendingUp,
    title: 'Better decisions',
    line: 'AI surfaces what matters so you act on signal, not noise.',
  },
  {
    icon: Zap,
    title: 'One place',
    line: 'Expenses, risk, inventory, and sustainability in a single platform.',
  },
  {
    icon: BarChart3,
    title: 'Real outcomes',
    line: 'Reduce waste, catch fraud earlier, and hit targets with confidence.',
  },
]

const MODULES = [
  { icon: Receipt, title: 'Expense Sense', desc: 'Track and analyze spending by category with clear trends.', color: '#38BDF8' },
  { icon: Shield, title: 'Fraud Lens', desc: 'Anomaly detection and alerts to protect your revenue.', color: '#2DD4BF' },
  { icon: Package, title: 'Smart Inventory', desc: 'Forecasts and reorder suggestions so you never stock out.', color: '#34D399' },
  { icon: Leaf, title: 'Green Grid', desc: 'Energy optimization and carbon footprint insights.', color: '#4ADE80' },
]

export default function LandingFeatures() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0.1, 0.35], [24, -12])

  return (
    <section id="features" ref={ref} className="relative overflow-hidden bg-ds-bg-elevated py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ds-bg-base/30 to-transparent dark:via-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div style={{ y }} className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          {/* Left: section heading + value/outcome highlights (no module repetition) */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ds-accent">
              Everything you need
            </p>
            <h2 className="mt-3 text-3xl font-bold text-ds-text-primary md:text-4xl">
              One platform. AI-driven insights.
            </h2>
            <p className="mt-4 text-lg text-ds-text-secondary">
              Get clarity across spending, risk, inventory, and sustainability — so you can focus on outcomes, not spreadsheets.
            </p>
            <ul className="mt-10 space-y-6">
              {VALUE_HIGHLIGHTS.map(({ icon: Icon, title, line }, i) => (
                <motion.li
                  key={title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ds-bg-surface shadow-ds-card">
                    <Icon className="h-5 w-5 text-ds-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ds-text-primary">{title}</h3>
                    <p className="mt-0.5 text-sm text-ds-text-secondary">{line}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right: modules grid only */}
          <div className="space-y-5">
            {MODULES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group rounded-2xl bg-ds-bg-surface/80 p-5 shadow-ds-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-ds-surface dark:bg-ds-bg-surface/70"
                style={{
                  background: 'linear-gradient(135deg, rgb(var(--ds-bg-surface) / 0.9), rgb(var(--ds-bg-surface) / 0.7))',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex shrink-0 rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ds-text-primary">{title}</h3>
                    <p className="mt-1 text-ds-text-secondary">{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
