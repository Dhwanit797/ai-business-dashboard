import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import * as api from '../services/api'
import Card from '../components/Card'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { pageVariants, pageTransition } from '../animations/pageVariants'

export default function SmartInventory() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof api.inventory.summary>> | null>(null)
  const [forecast, setForecast] = useState<Awaited<ReturnType<typeof api.inventory.forecast>> | null>(null)

  useEffect(() => {
    api.inventory.summary().then(setSummary).catch(() => setSummary(null))
    api.inventory.forecast().then(setForecast).catch(() => setForecast(null))
  }, [])

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="space-y-8"
    >
      <h1 className="text-2xl font-bold text-ds-text-primary">Smart Inventory AI</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-medium text-ds-text-muted">Stock levels</h3>
          {summary?.items ? (
            <motion.ul
              className="space-y-3"
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
            >
              {summary.items.map((item, i) => (
                <motion.li
                  key={item.name}
                  variants={{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }}
                  className="flex items-center justify-between rounded-lg bg-ds-bg-surface px-4 py-3"
                >
                  <span className="font-medium text-ds-text-primary">{item.name}</span>
                  <span className={item.stock < item.reorder_at ? 'text-amber-400' : 'text-ds-text-secondary'}>
                    {item.stock} / reorder at {item.reorder_at}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <LoadingSkeleton />
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-medium text-ds-text-muted">Reorder suggestions</h3>
          {summary?.suggestions?.length ? (
            <ul className="space-y-2">
              {summary.suggestions.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-ds-text-secondary">
                  <span className="text-emerald-400">•</span> {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No reorder needed</p>
          )}
          {summary && (
            <p className="mt-4 text-sm text-slate-500">
              Low stock items: {summary.low_stock_count}
            </p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-sm font-medium text-ds-text-muted">Forecast (next weeks)</h3>
        {forecast?.length ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast}>
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="predicted_stock" name="Predicted stock" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <LoadingSkeleton />
        )}
      </Card>
    </motion.div>
  )
}
