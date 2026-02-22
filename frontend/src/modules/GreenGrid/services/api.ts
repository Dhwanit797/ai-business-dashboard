import { api, uploadCsv } from '../../../services/api'

export const greenApi = {
    data: () => api<{ current_usage_kwh: number; suggested_peak_shift: number; potential_savings_percent: number; recommendations: string[] }>('/green-grid/data'),
    chart: () => api<{ hour: string; usage: number }[]>('/green-grid/chart'),
    upload: (file: File) =>
        uploadCsv<{ labels: string[]; values: number[]; average: number }>('/green-grid/upload-csv', file),
}
