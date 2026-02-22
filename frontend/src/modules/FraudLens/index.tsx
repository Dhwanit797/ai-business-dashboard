import { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Shield } from 'lucide-react'
import { fraudApi } from './services/api'
import Card from '../../components/Card'
import PageHeader from '../../components/PageHeader'
import ModuleLayout from '../../components/module/ModuleLayout'
import PreInsightLayout from '../../components/module/PreInsightLayout'
import StatsGrid from '../../components/module/StatsGrid'
import CsvUpload from '../../components/CsvUpload'

const COLORS = { normal: '#3b82f6', fraud: '#f59e0b' }

function riskColor(pct: number): string {
  if (pct < 20) return 'text-emerald-400'
  if (pct <= 50) return 'text-amber-400'
  return 'text-red-400'
}

function riskBg(pct: number): string {
  if (pct < 20) return 'bg-emerald-500/20'
  if (pct <= 50) return 'bg-amber-500/20'
  return 'bg-red-500/20'
}

export default function FraudLens() {
  const [pieData, setPieData] = useState<{ name: string; value: number }[] | null>(null)
  const [fraudCount, setFraudCount] = useState<number | null>(null)
  const [normalCount, setNormalCount] = useState<number | null>(null)
  const [fraudPercentage, setFraudPercentage] = useState<number | null>(null)
  const [hasData, setHasData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setError(null)
    try {
      const data = await fraudApi.upload(file)
      setFraudCount(data.fraud_count)
      setNormalCount(data.normal_count)
      setFraudPercentage(data.fraud_percentage)
      setPieData([
        { name: 'Normal', value: data.normal_count },
        { name: 'Fraud', value: data.fraud_count },
      ])
      setHasData(true)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPieData(null)
      setFraudCount(null)
      setNormalCount(null)
      setFraudPercentage(null)
    }
  }

  // ─── Pre-Insight State ────────────────────────────────────────────
  if (!hasData) {
    return (
      <ModuleLayout>
        <PreInsightLayout
          moduleTitle="Fraud Lens"
          tagline="Unmask hidden threats in your transaction data."
          bullets={[
            'Anomaly detection across all transactions',
            'Risk scoring and fraud distribution analysis',
            'Normal vs fraudulent transaction breakdown',
          ]}
          icon={Shield}
          accentColor="#2DD4BF"
          lockedMetrics={['Fraud Count', 'Normal Count', 'Risk Level']}
          csvColumns={['transaction_id', 'amount', 'is_fraud']}
          onUpload={handleFileUpload}
        />
      </ModuleLayout>
    )
  }

  // ─── Data View ────────────────────────────────────────────────────
  const pct = fraudPercentage ?? 0

  return (
    <ModuleLayout>
      <PageHeader
        title="Fraud Lens"
        action={
          <CsvUpload
            onUpload={handleFileUpload}
            title="Upload Transactions"
            description="Scan CSV for fraud"
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
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Fraud count</h3>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold text-ds-text-primary"
          >
            {fraudCount ?? 0}
          </motion.p>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Normal count</h3>
          <p className="text-3xl font-bold text-ds-text-primary">{normalCount ?? 0}</p>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Risk level</h3>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${riskColor(pct)} ${riskBg(pct)}`}
          >
            {pct < 20 ? 'Low' : pct <= 50 ? 'Medium' : 'High'} ({pct}%)
          </motion.span>
        </Card>
      </StatsGrid>

      <Card>
        <h3 className="mb-4 text-sm font-medium text-ds-text-muted">Fraud vs normal</h3>
        {pieData?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  <Cell fill={COLORS.normal} />
                  <Cell fill={COLORS.fraud} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg bg-ds-bg-base/50 text-sm text-ds-text-muted">
            No chart data
          </div>
        )}
      </Card>
    </ModuleLayout>
  )
}
