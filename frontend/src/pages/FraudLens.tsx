import { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import * as api from '../services/api'
import Card from '../components/Card'
import CsvUpload from '../components/CsvUpload'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { pageVariants, pageTransition } from '../animations/pageVariants'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    setFileName(file.name)
    try {
      const data = await api.fraud.upload(file)
      setFraudCount(data.fraud_count)
      setNormalCount(data.normal_count)
      setFraudPercentage(data.fraud_percentage)
      setPieData([
        { name: 'Normal', value: data.normal_count },
        { name: 'Fraud', value: data.fraud_count },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPieData(null)
      setFraudCount(null)
      setNormalCount(null)
      setFraudPercentage(null)
    } finally {
      setLoading(false)
    }
  }

  const pct = fraudPercentage ?? 0

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
        <h1 className="text-2xl font-bold text-ds-text-primary">Fraud Lens</h1>
        <CsvUpload
          onUpload={handleFileUpload}
          loading={loading}
          fileName={fileName}
          disabled={loading}
        />
      </div>
      {error && (
        <div className="rounded-lg border border-ds-accent-danger/30 bg-ds-accent-danger/10 px-4 py-3 text-sm text-ds-accent-danger">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Fraud count</h3>
          {fraudCount != null ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-3xl font-bold text-ds-text-primary"
            >
              {fraudCount}
            </motion.p>
          ) : (
            <div className="flex h-14 items-center text-ds-text-muted">
              {loading ? <LoadingSkeleton /> : <p className="text-sm">Upload CSV</p>}
            </div>
          )}
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Normal count</h3>
          {normalCount != null ? (
            <p className="text-3xl font-bold text-ds-text-primary">{normalCount}</p>
          ) : (
            <div className="flex h-14 items-center text-ds-text-muted">
              <p className="text-sm">—</p>
            </div>
          )}
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-medium text-ds-text-muted">Risk level</h3>
          {fraudPercentage != null ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${riskColor(pct)} ${riskBg(pct)}`}
            >
              {pct < 20 ? 'Low' : pct <= 50 ? 'Medium' : 'High'} ({pct}%)
            </motion.span>
          ) : (
            <div className="flex h-14 items-center text-ds-text-muted">
              {loading ? <LoadingSkeleton /> : <p className="text-sm">Upload CSV</p>}
            </div>
          )}
        </Card>
      </div>

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
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill={COLORS.normal} />
                  <Cell fill={COLORS.fraud} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg bg-ds-bg-base/50 text-ds-text-muted">
            {loading ? <LoadingSkeleton /> : <p className="text-sm">Upload a CSV to see distribution</p>}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
