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
]

export default orderRoutes

