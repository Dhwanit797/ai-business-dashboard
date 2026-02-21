import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts'
import * as api from '../services/api'
import Card from '../components/Card'
import CsvUpload from '../components/CsvUpload'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { pageVariants, pageTransition } from '../animations/pageVariants'

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4']

type ChartItem = { name: string; value: number }
type TrendItem = { month: string; amount: number }
type Stats = { total: number; trend?: string; trend_percent?: number }

export default function ExpenseSense() {
  const [chartData, setChartData] = useState<ChartItem[] | null>(null)
  const [trends, setTrends] = useState<TrendItem[] | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    setFileName(file.name)
    try {
      const data = await api.expense.upload(file)
      const byCategory: ChartItem[] = (data.labels || []).map((label, i) => ({
        name: label,
        value: data.values?.[i] ?? 0,
      }))
      setChartData(byCategory.length ? byCategory : null)
      setStats({
        total: data.total ?? 0,
        trend: (data as { trend?: string }).trend,
        trend_percent: (data as { trend_percent?: number }).trend_percent,
      })
      if (data.trends?.length) {
        setTrends(data.trends)
      } else if (data.labels?.length && data.values?.length) {
        setTrends([{ month: 'Upload', amount: data.total ?? 0 }])
      } else {
        setTrends(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setChartData(null)
      setTrends(null)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-ds-text-primary">Expense Sense</h1>
        <CsvUpload
          onUpload={handleFileUpload}
          loading={loading}
          fileName={fileName}
          disabled={loading}
        />
      </div>
      {error && (
        <div className="rounded-lg bg-ds-accent-danger/10 border border-ds-accent-danger/30 px-4 py-3 text-sm text-ds-accent-danger">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-medium text-ds-text-muted">By category</h3>
          {chartData?.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg bg-ds-bg-base/50 text-ds-text-muted">
              {loading ? <LoadingSkeleton /> : <p className="text-sm">Upload a CSV to see breakdown</p>}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-medium text-ds-text-muted">Summary & trend</h3>
          {stats ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <p className="text-3xl font-bold text-ds-text-primary">{stats.total}</p>
              <p className="text-ds-text-muted">Total expense</p>
              {stats.trend != null && stats.trend_percent != null && (
                <div className="flex items-center gap-2">
                  <span className={stats.trend === 'up' ? 'text-amber-400' : 'text-emerald-400'}>
                    {stats.trend === 'up' ? '↑' : '↓'} {Math.abs(stats.trend_percent)}%
                  </span>
                  <span className="text-ds-text-muted">vs previous period</span>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex h-40 items-center justify-center text-ds-text-muted">
              {loading ? <LoadingSkeleton /> : <p className="text-sm">Upload a CSV to see summary</p>}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-sm font-medium text-ds-text-muted">Monthly trend</h3>
        {trends?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg bg-ds-bg-base/50 text-ds-text-muted">
            {loading ? <LoadingSkeleton /> : <p className="text-sm">Upload a CSV to see trend</p>}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
