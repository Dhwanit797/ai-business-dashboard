import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import * as api from '../services/api'
import Card from '../components/Card'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { pageVariants, pageTransition } from '../animations/pageVariants'

export default function SmartInventory() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof api.inventory.summary>> | null>(null)
  const [forecast, setForecast] = useState<Awaited<ReturnType<typeof api.inventory.forecast>> | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')

  const loadData = () => {
    api.inventory.summary().then(setSummary).catch(() => setSummary(null))
    api.inventory.forecast().then(setForecast).catch(() => setForecast(null))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setUploadStatus('error')
      setUploadMessage('Please upload a .csv file')
      return
    }

    setIsUploading(true)
    setUploadStatus('idle')
    try {
      const res = await api.inventory.upload(file)
      if (res.success) {
        setUploadStatus('success')
        setUploadMessage(`Successfully added ${res.records_added} records`)
        loadData()
      }
    } catch (err: any) {
      setUploadStatus('error')
      setUploadMessage(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
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
      <h1 className="text-2xl font-bold text-ds-text-primary">Smart Inventory AI</h1>

      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-medium text-ds-text-primary flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-indigo-400" />
              Upload Inventory CSV
            </h3>
            <p className="text-sm text-ds-text-muted mt-1">
              Bulk upload new inventory records or update existing quantities via CSV.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {isUploading ? 'Uploading...' : 'Select CSV File'}
            </button>

            <AnimatePresence mode="wait">
              {uploadStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`flex items-center gap-2 text-sm ${uploadStatus === 'success' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                >
                  {uploadStatus === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {uploadMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

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
