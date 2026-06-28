import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface OrderShipping {
  id?: number
  code: string
  name: string
  description?: string | null
  translations?: Record<number, OrderShippingTranslation>
  type?: string | null
  color?: string | null
  price?: number | null
  created_at?: string
  updated_at?: string
}

export interface OrderShippingTranslation {
  name: string
  description: string
}

export interface OrderShippingFormData {
  code: string
  translations: Record<number, OrderShippingTranslation>
  type?: string
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
  columns?: Array<{ key: string; label: string; sortable: boolean }>
}

export interface SingleResponse<T> {
  data: T
}

export const orderShippingService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<OrderShipping>>('/api/admin/order/order-shippings', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<OrderShipping>>(`/api/admin/order/order-shippings/${id}`)
  },
  getCreateData() {
    return api.get('/api/admin/order/order-shippings/create')
  },
  getEditData(id: number | string) {
    return api.get<{ data: OrderShipping }>(`/api/admin/order/order-shippings/${id}/edit`)
  },
  create(orderShipping: OrderShippingFormData) {
    return api.post<OrderShipping>('/api/admin/order/order-shippings', orderShipping)
  },
  update(id: number | string, orderShipping: OrderShippingFormData) {
    return api.put<OrderShipping>(`/api/admin/order/order-shippings/${id}`, orderShipping)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/order/order-shippings/${id}`)
  },
}

