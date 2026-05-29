import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface OrderPayment {
  id?: number
  code: string
  name: string
  description?: string | null
  translations?: Record<number, OrderPaymentTranslation>
  color?: string | null
  price?: number | null
  created_at?: string
  updated_at?: string
}

export interface OrderPaymentTranslation {
  name: string
  description: string
}

export interface OrderPaymentFormData {
  code: string
  translations: Record<number, OrderPaymentTranslation>
  color?: string
  price?: number
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
}

export interface SingleResponse<T> {
  data: T
}

export const orderPaymentService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<OrderPayment>>('/api/admin/order/order-payments', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<OrderPayment>>(`/api/admin/order/order-payments/${id}`)
  },
  getCreateData() {
    return api.get('/api/admin/order/order-payments/create')
  },
  getEditData(id: number | string) {
    return api.get<{ data: OrderPayment }>(`/api/admin/order/order-payments/${id}/edit`)
  },
  create(orderPayment: OrderPaymentFormData) {
    return api.post<OrderPayment>('/api/admin/order/order-payments', orderPayment)
  },
  update(id: number | string, orderPayment: OrderPaymentFormData) {
    return api.put<OrderPayment>(`/api/admin/order/order-payments/${id}`, orderPayment)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/order/order-payments/${id}`)
  },
}

