import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Receipt, Shield, Package, Leaf, Download } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import * as api from '../services/api'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { staggerContainer, staggerItem } from '../animations/transitions'

const modules = [
  { to: '/modules/expense', label: 'Expense Sense', icon: Receipt, color: '#38BDF8' },
  { to: '/modules/fraud', label: 'Fraud Lens', icon: Shield, color: '#2DD4BF' },
  { to: '/modules/inventory', label: 'Smart Inventory', icon: Package, color: '#34D399' },
  { to: '/modules/green-grid', label: 'Green Grid', icon: Leaf, color: '#4ADE80' },
]

const CHART_COLORS = ['#38BDF8', '#34D399', '#2DD4BF', '#4ADE80', '#22D3EE', '#A78BFA']

export default function Dashboard() {
  const [health, setHealth] = useState<Awaited<ReturnType<typeof api.health.score>> | null>(null)
  const [recs, setRecs] = useState<Awaited<ReturnType<typeof api.recommendations.list>> | null>(null)
  const [carbon, setCarbon] = useState<Awaited<ReturnType<typeof api.carbon.estimate>> | null>(null)
  const [expenseSummary, setExpenseSummary] = useState<Awaited<ReturnType<typeof api.expense.summary>> | null>(null)
  const [reportLoading, setReportLoading] = useState(false)

  useEffect(() => {
    api.health.score().then(setHealth).catch(() => setHealth(null))
    api.recommendations.list().then(setRecs).catch(() => setRecs(null))
    api.carbon.estimate().then(setCarbon).catch(() => setCarbon(null))
    api.expense.summary().then(setExpenseSummary).catch(() => setExpenseSummary(null))
  }, [])

  async function handleDownloadReport() {
    setReportLoading(true)
    try {
      const blob = await api.report.pdf()
      const url = URL.createObjectURL(blob as Blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'business_report.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    } finally {
      setReportLoading(false)
    }
  }

  const healthScore = health?.score ?? 0
  const healthColor =
    healthScore >= 80 ? '#34D399' : healthScore >= 65 ? '#38BDF8' : healthScore >= 50 ? '#FBBF24' : '#F87171'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Page header */}
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-ds-text-primary md:text-3xl">
          Business Intelligence
        </h1>
        <p className="mt-1 text-ds-text-secondary">
          Key metrics, modules, and AI recommendations
        </p>
      </div>

      {/* Top: Business Health Score — primary focus */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ds-text-primary">Business Health Score</h2>
        <div
          className="rounded-2xl bg-ds-bg-surface p-8"
          style={{ boxShadow: 'var(--ds-surface-shadow)' }}
        >
          {health ? (
            <div className="flex flex-col items-center md:flex-row md:items-center md:justify-around">
              <div className="flex flex-col items-center">
                <svg className="h-36 w-36" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2.5"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={healthColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${healthScore}, 100`}
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${healthScore}, 100` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
                <AnimatedCounter value={healthScore} className="mt-2 text-3xl font-bold" style={{ color: healthColor }} />
                <span className="text-ds-text-secondary">/ 100</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 md:mt-0">
                {health.factors.map((f) => (
                  <div key={f.name} className="rounded-xl bg-ds-bg-elevated px-4 py-2">
                    <p className="text-sm text-ds-text-secondary">{f.name}</p>
                    <p className="text-lg font-semibold text-ds-text-primary">{f.score}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      </section>

      {/* Modules */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ds-text-primary">Modules</h2>
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {modules.map(({ to, label, icon: Icon, color }) => (
            <motion.div key={to} variants={staggerItem}>
              <Link
                to={to}
                className="flex items-center gap-4 rounded-2xl bg-ds-bg-surface p-5 transition hover:shadow-lg"
                style={{ boxShadow: 'var(--ds-card-shadow)' }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}25` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <span className="font-semibold text-ds-text-primary">{label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Expense + Charts */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ds-text-primary">Expense by category</h2>
        <div
          className="rounded-2xl bg-ds-bg-surface p-6"
          style={{ boxShadow: 'var(--ds-card-shadow)' }}
        >
          {expenseSummary?.by_category ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseSummary.by_category}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseSummary.by_category.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgb(18 26 43)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#F5F7FA',
                      padding: '12px 16px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      </section>

      {/* AI Recommendations */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ds-text-primary">AI Recommendations</h2>
        <div
          className="rounded-2xl bg-ds-bg-surface p-6"
          style={{ boxShadow: 'var(--ds-card-shadow)' }}
        >
          {recs ? (
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {recs.map((r) => (
                <motion.div
                  key={r.id}
                  variants={staggerItem}
                  className="flex items-center gap-4 rounded-xl bg-ds-bg-elevated p-4"
                >
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-medium text-ds-text-primary">{r.title}</p>
                    <p className="text-sm text-ds-text-muted">{r.priority} priority</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      </section>

      {/* Carbon + Report */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ds-text-primary">Sustainability & reports</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div
            className="rounded-2xl bg-ds-bg-surface p-6"
            style={{ boxShadow: 'var(--ds-card-shadow)' }}
          >
            <h3 className="mb-4 text-sm font-medium text-ds-text-secondary">Carbon footprint</h3>
            {carbon ? (
              <div className="flex items-center gap-6">
                <div className="rounded-2xl bg-ds-bg-elevated px-5 py-3">
                  <AnimatedCounter value={carbon.kg_co2_per_year} className="text-2xl font-bold text-ds-accent-success" />
                  <span className="ml-1 text-ds-text-secondary">kg CO₂/yr</span>
                </div>
                <div>
                  <p className="text-ds-text-primary">{carbon.equivalent}</p>
                  <p className="text-sm text-ds-text-muted">Rating: {carbon.rating}</p>
                </div>
              </div>
            ) : (
              <LoadingSkeleton />
            )}
          </div>
          <div
            className="rounded-2xl bg-ds-bg-surface p-6"
            style={{ boxShadow: 'var(--ds-card-shadow)' }}
          >
            <h3 className="mb-4 text-sm font-medium text-ds-text-secondary">Report</h3>
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={reportLoading}
              className="flex items-center gap-2 rounded-xl bg-ds-accent px-5 py-3 font-semibold text-ds-text-inverse transition hover:bg-[#7DD3FC] disabled:opacity-60"
            >
              {reportLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0B1220]/30 border-t-[#0B1220]" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              Download PDF Report
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
