import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Leaf } from 'lucide-react'
import { greenApi } from './services/api'
import Card from '../../components/Card'
import PageHeader from '../../components/PageHeader'
import ModuleLayout from '../../components/module/ModuleLayout'
import PreInsightLayout from '../../components/module/PreInsightLayout'
import StatsGrid from '../../components/module/StatsGrid'
import CsvUpload from '../../components/CsvUpload'

type ChartPoint = { name: string; usage: number }

export default function GreenGrid() {
  const [chartData, setChartData] = useState<ChartPoint[] | null>(null)
  const [average, setAverage] = useState<number | null>(null)
  const [hasData, setHasData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setError(null)
    try {
      const data = await greenApi.upload(file)
      const points: ChartPoint[] = (data.labels || []).map((label, i) => ({
        name: label,
        usage: data.values?.[i] ?? 0,
      }))
      setChartData(points.length ? points : null)
      setAverage(data.average ?? null)
      setHasData(true)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setChartData(null)
      setAverage(null)
    }
  }

  // ─── Pre-Insight State ────────────────────────────────────────────
  if (!hasData) {
    return (
      <ModuleLayout>
        <PreInsightLayout
          moduleTitle="Green Grid Optimizer"
          tagline="Optimize energy consumption with data-driven efficiency."
          bullets={[
            'Hourly and daily usage trend analysis',
            'Peak consumption detection and shift recommendations',
            'Environmental impact scoring and benchmarking',
          ]}
          icon={Leaf}
          accentColor="#4ADE80"
          lockedMetrics={['Average Usage (kWh)', 'Data Points', 'Grid Status']}
          csvColumns={['hour', 'usage_kwh']}
          onUpload={handleFileUpload}
        />
      </ModuleLayout>
    )
  }

  // ─── Data View ────────────────────────────────────────────────────
  return (
    <ModuleLayout>
      <PageHeader
        title="Green Grid Optimizer"
        action={
          <CsvUpload
            onUpload={handleFileUpload}
            title="Upload Grid Data"
            description="Process energy CSV records"
          />
        }
      />

      {error && (
        <div className="rounded-lg border border-ds-accent-danger/30 bg-ds-accent-danger/10 px-4 py-3 text-sm text-ds-accent-danger">
          {error}
        </div>
      )}

      <StatsGrid columns={3}>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Average usage</h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-ds-text-primary"
          >
            {average != null ? `${average} kWh` : '—'}
          </motion.p>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Data points</h3>
          <p className="text-3xl font-bold text-ds-text-primary">{chartData?.length ?? 0}</p>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Status</h3>
          <p className="text-lg font-medium text-emerald-400">
            {chartData?.length ? 'Data loaded' : 'Awaiting upload'}
          </p>
        </Card>
      </StatsGrid>

      <Card>
        <h3 className="mb-4 text-sm font-medium text-ds-text-muted">Usage trend</h3>
        {chartData?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="usage" stroke="#22c55e" fill="url(#usageGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg bg-ds-bg-base/50 text-sm text-ds-text-muted">
            No usage data
          </div>
        )}
      </Card>
    </ModuleLayout>
  )
}
