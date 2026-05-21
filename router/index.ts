import type { RouteRecordRaw } from 'vue-router'

const orderRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/order',
    name: 'order.index',
    component: () => import('../views/Orders.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order/create',
    name: 'order.create',
    component: () => import('../views/OrderCreate.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order/:id',
    name: 'order.show',
    component: () => import('../views/OrderShow.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order/:id/edit',
    name: 'order.edit',
    component: () => import('../views/OrderEdit.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-status',
    name: 'order-status.index',
    component: () => import('../views/OrderStatuses.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-status/create',
    name: 'order-status.create',
    component: () => import('../views/OrderStatusCreate.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-status/:id/edit',
    name: 'order-status.edit',
    component: () => import('../views/OrderStatusEdit.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-payment',
    name: 'order-payment.index',
    component: () => import('../views/OrderPayments.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-payment/create',
    name: 'order-payment.create',
    component: () => import('../views/OrderPaymentCreate.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-payment/:id/edit',
    name: 'order-payment.edit',
    component: () => import('../views/OrderPaymentEdit.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-shipping',
    name: 'order-shipping.index',
    component: () => import('../views/OrderShippings.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-shipping/create',
    name: 'order-shipping.create',
    component: () => import('../views/OrderShippingCreate.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/order-shipping/:id/edit',
    name: 'order-shipping.edit',
    component: () => import('../views/OrderShippingEdit.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
]

export default orderRoutes
