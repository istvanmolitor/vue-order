import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface OrderStatusItem {
  id?: number
  code: string
  name: string
  description?: string | null
  color?: string | null
  translations?: Record<number, OrderStatusTranslation>
  created_at?: string
  updated_at?: string
}

export interface OrderStatusTranslation {
  name: string
  description: string
}

export interface OrderStatusFormData {
  code: string
  translations: Record<number, OrderStatusTranslation>
  color?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters?: {
    search?: string
    sort?: string
    direction?: string
  }
  columns?: Array<{ key: string; label: string; sortable: boolean }>
}

export interface SingleResponse<T> {
  data: T
}

export const orderStatusService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<OrderStatusItem>>('/api/admin/order/order-statuses', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<OrderStatusItem>>(`/api/admin/order/order-statuses/${id}`)
  },
  getCreateData() {
    return api.get('/api/admin/order/order-statuses/create')
  },
  getEditData(id: number | string) {
    return api.get<{ data: OrderStatusItem }>(`/api/admin/order/order-statuses/${id}/edit`)
  },
  create(orderStatus: OrderStatusFormData) {
    return api.post<OrderStatusItem>('/api/admin/order/order-statuses', orderStatus)
  },
  update(id: number | string, orderStatus: OrderStatusFormData) {
    return api.put<OrderStatusItem>(`/api/admin/order/order-statuses/${id}`, orderStatus)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/order/order-statuses/${id}`)
  },
}

