import { api, uploadCsv } from '../../../services/api'

export const inventoryApi = {
    summary: () => api<{ items: { name: string; stock: number; reorder_at: number }[]; low_stock_count: number; suggestions: string[] }>('/inventory/summary'),
    forecast: () => api<{ week: string; predicted_stock: number }[]>('/inventory/forecast'),
    upload: (file: File) =>
        uploadCsv<{ success: boolean; records_added: number; errors: string[] }>('/inventory/upload-csv', file),
}
