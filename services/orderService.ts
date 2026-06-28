import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface OrderCustomer {
  id: number
  name: string
}

export interface Order {
  id?: number
  code: string
  customer_id: number
  currency_id: number
  order_status_id: number
  is_closed: boolean
  comment?: string | null
  internal_comment?: string | null
  phone?: string | null
  referer?: string | null
  invoice?: boolean
  created_at?: string
  updated_at?: string
  customer?: OrderCustomer | null
  orderStatus?: OrderStatus | null
  orderItems?: OrderItem[]
}

export interface OrderItem {
  id?: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: {
    id?: number
    sku?: string | null
    name?: string | null
    image_url?: string | null
  } | null
  created_at?: string
  updated_at?: string
}

export interface OrderStatus {
  id: number
  name: string
  color?: string
}

export interface OrderFormData {
  customer_id: number
  order_status_id: number
  is_closed: boolean
  comment?: string
  internal_comment?: string
  phone?: string
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

export const orderService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<Order>>('/api/admin/order/orders', { params })
  },
  getById(id: number | string) {
    return api.get<Order>(`/api/admin/order/orders/${id}`)
  },
  getCreateData() {
    return api.get<{ order_statuses: OrderStatus[] }>('/api/admin/order/orders/create')
  },
  getEditData(id: number | string) {
    return api.get<{ data: Order; order_statuses: OrderStatus[] }>(`/api/admin/order/orders/${id}/edit`)
  },
  create(order: OrderFormData) {
    return api.post<Order>('/api/admin/order/orders', order)
  },
  update(id: number | string, order: OrderFormData) {
    return api.put<Order>(`/api/admin/order/orders/${id}`, order)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/order/orders/${id}`)
  },
}

