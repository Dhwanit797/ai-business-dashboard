import { motion } from 'framer-motion'

/** Subtle transition between sections: thin animated glowing separator */
export default function SectionDivider() {
  return (
    <div className="relative flex justify-center py-8 md:py-12" aria-hidden>
      <motion.div
        className="h-px w-full max-w-md"
        style={{
          background: 'linear-gradient(90deg, transparent, rgb(var(--ds-accent) / 0.25), rgb(var(--ds-accent-teal) / 0.2), transparent)',
        }}
        initial={{ opacity: 0.5, scaleX: 0.8 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute h-1 w-1 rounded-full bg-ds-accent"
        style={{
          boxShadow: '0 0 12px rgb(var(--ds-accent) / 0.6)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      />
    </div>
  )
}
