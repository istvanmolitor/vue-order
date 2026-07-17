// Services
export { orderService } from './services/orderService'
export { orderStatusService } from './services/orderStatusService'
export { orderPaymentService } from './services/orderPaymentService'
export { orderShippingService } from './services/orderShippingService'
export type {
  Order,
  OrderItem,
  OrderStatus,
  OrderCustomer,
  OrderFormData,
  PaginatedResponse,
  SingleResponse
} from './services/orderService'
export type { OrderStatusItem, OrderStatusFormData } from './services/orderStatusService'
export type { OrderPayment, OrderPaymentFormData, OrderShippingSimple } from './services/orderPaymentService'
export type { OrderShipping, OrderShippingFormData, OrderPaymentSimple } from './services/orderShippingService'

// Router
export { default as router } from './router/index'

// Menu configuration
export { OrderMenuBuilder, orderMenuBuilder } from './config/menuBuilder'
export { OrderDashboardBuilder, orderDashboardBuilder } from './config/dashboardBuilder'
