import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Loader2 } from 'lucide-react'

type Props = {
  onUpload: (file: File) => void
  loading?: boolean
  fileName?: string | null
  accept?: string
  disabled?: boolean
}

export default function CsvUpload({
  onUpload,
  loading = false,
  fileName = null,
  accept = '.csv',
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpload(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled || loading) return
    const file = e.dataTransfer.files?.[0]
    if (file?.name.toLowerCase().endsWith('.csv')) onUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled || loading}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && !loading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          flex min-h-[88px] w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
          bg-ds-bg-surface/50 px-4 py-4 transition-colors
          dark:bg-ds-bg-surface/30
          ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'hover:border-ds-accent/50 hover:bg-ds-bg-surface/80'}
          ${fileName ? 'border-ds-accent/40' : 'border-ds-text-muted/30'}
        `}
      >
        {loading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-ds-accent" />
            <span className="text-sm font-medium text-ds-text-secondary">Processing…</span>
          </>
        ) : fileName ? (
          <>
            <FileText className="h-8 w-8 text-ds-accent" />
            <span className="truncate text-sm font-medium text-ds-text-primary" title={fileName}>
              {fileName}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
              className="text-xs text-ds-accent hover:underline"
            >
              Upload another file
            </button>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-ds-text-muted" />
            <span className="text-sm font-medium text-ds-text-secondary">
              Drop CSV here or click to upload
            </span>
          </>
        )}
      </div>
    </div>
  )
}
