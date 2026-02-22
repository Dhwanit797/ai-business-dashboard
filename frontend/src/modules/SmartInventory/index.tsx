import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Package } from 'lucide-react'
import { inventoryApi } from './services/api'
import Card from '../../components/Card'
import PageHeader from '../../components/PageHeader'
import ModuleLayout from '../../components/module/ModuleLayout'
import PreInsightLayout from '../../components/module/PreInsightLayout'
import StatsGrid from '../../components/module/StatsGrid'
import CsvUpload from '../../components/CsvUpload'

export default function SmartInventory() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof inventoryApi.summary>> | null>(null)
  const [forecast, setForecast] = useState<Awaited<ReturnType<typeof inventoryApi.forecast>> | null>(null)
  const [hasData, setHasData] = useState(false)

  const loadData = () => {
    inventoryApi.summary().then(setSummary).catch(() => setSummary(null))
    inventoryApi.forecast().then(setForecast).catch(() => setForecast(null))
  }

  // NO useEffect — demo data is NOT loaded on mount

  const handleFileUpload = async (file: File) => {
    const res = await inventoryApi.upload(file)
    if (res.success) {
      loadData()
      setHasData(true)
      return res
    }
    throw new Error('Upload failed')
  }

  // ─── Pre-Insight State ────────────────────────────────────────────
  if (!hasData) {
    return (
      <ModuleLayout>
        <PreInsightLayout
          moduleTitle="Smart Inventory"
          tagline="Predict demand and optimize stock levels with intelligence."
          bullets={[
            'Real-time stock level monitoring across items',
            'AI-driven reorder suggestion engine',
            'Weekly demand forecasting and predictions',
          ]}
          icon={Package}
          accentColor="#34D399"
          lockedMetrics={['Stock Items', 'Low Stock Count', 'Forecast Weeks']}
          csvColumns={['name', 'stock', 'reorder_at']}
          onUpload={handleFileUpload}
          successMessage={(res) => `Successfully added ${res.records_added} records`}
        />
      </ModuleLayout>
    )
  }

  // ─── Data View ────────────────────────────────────────────────────
  return (
    <ModuleLayout>
      <PageHeader
        title="Smart Inventory AI"
        action={
          <CsvUpload
            onUpload={handleFileUpload}
            title="Upload Inventory CSV"
            description="Bulk upload new inventory records or update existing quantities via CSV."
            successMessage={(res) => `Successfully added ${res.records_added} records`}
          />
        }
      />

      <StatsGrid columns={3}>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Total items</h3>
          <p className="text-3xl font-bold text-ds-text-primary">{summary?.items?.length ?? 0}</p>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Low stock items</h3>
          <p className="text-3xl font-bold text-amber-400">{summary?.low_stock_count ?? 0}</p>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Forecast weeks</h3>
          <p className="text-3xl font-bold text-ds-text-primary">{forecast?.length ?? 0}</p>
        </Card>
      </StatsGrid>

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
              {summary.items.map((item) => (
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
            <p className="text-sm text-ds-text-muted">Loading stock data…</p>
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
            <p className="text-sm text-ds-text-muted">No reorder needed</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-sm font-medium text-ds-text-muted">Forecast (next weeks)</h3>
        {forecast?.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast}>
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="predicted_stock" name="Predicted stock" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <p className="text-sm text-ds-text-muted">Loading forecast data…</p>
        )}
      </Card>
    </ModuleLayout>
  )
}
