import { motion } from 'framer-motion'
import { Upload, Cpu, TrendingUp, Sparkles } from 'lucide-react'

const STEPS = [
  {
    icon: Upload,
    title: 'Connect your data',
    desc: 'Link expenses, inventory, and sustainability sources in one place.',
  },
  {
    icon: Cpu,
    title: 'AI analyzes & learns',
    desc: 'Our engine detects patterns, anomalies, and opportunities in real time.',
  },
  {
    icon: TrendingUp,
    title: 'Act on insights',
    desc: 'Get clear recommendations and forecasts so you can optimize with confidence.',
  },
  {
    icon: Sparkles,
    title: 'Scale with clarity',
    desc: 'From single teams to the whole business. Stay in control as you grow.',
  },
]

export default function SectionHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative flex w-full flex-col items-center justify-center bg-ds-bg-elevated px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          className="text-sm font-semibold uppercase tracking-wider text-ds-accent"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How it works
        </motion.p>
        <motion.h2
          className="mt-3 text-3xl font-bold text-ds-text-primary md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          Four steps to smarter business
        </motion.h2>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            className="flex flex-col items-center rounded-2xl bg-ds-bg-surface/80 p-6 text-center shadow-ds-card transition-shadow hover:shadow-ds-surface dark:bg-ds-bg-surface/70"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--ds-accent) / 0.18), rgb(var(--ds-accent-teal) / 0.12))',
              }}
            >
              <Icon className="h-6 w-6 text-ds-accent" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ds-text-primary">{title}</h3>
            <p className="mt-2 text-sm text-ds-text-secondary">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
