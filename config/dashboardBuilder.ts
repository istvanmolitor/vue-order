import { DashboardWidgetBuilder, type DashboardWidgetConfig } from '@admin/lib/dashboard'
import OrderCountWidget from '../components/dashboard/OrderCountWidget.vue'

export class OrderDashboardBuilder extends DashboardWidgetBuilder {
  build(widgets: DashboardWidgetConfig[]): DashboardWidgetConfig[] {
    this.addWidget(widgets, {
      id: 'order-count-widget',
      component: OrderCountWidget,
      order: 20,
    })

    return widgets
  }
}

export const orderDashboardBuilder = new OrderDashboardBuilder()


