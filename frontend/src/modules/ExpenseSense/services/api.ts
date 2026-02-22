import { api, uploadCsv } from '../../../services/api'

export const expenseApi = {
    summary: () => api<{ by_category: { name: string; value: number }[]; total: number; trend: string; trend_percent: number }>('/expense/summary'),
    trends: () => api<{ month: string; amount: number }[]>('/expense/trends'),
    upload: (file: File) =>
        uploadCsv<{ labels: string[]; values: number[]; total: number; trends?: { month: string; amount: number }[] }>('/expense/upload-csv', file),
}
