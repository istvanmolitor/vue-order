import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { ShoppingCart, BadgeCheck, CreditCard, Truck } from 'lucide-vue-next'

/**
 * Order Menu Builder
 * Builds the order management menu structure
 */
export class OrderMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      return this.buildMainMenu(menu)
    }
    return menu
  }

  /**
   * Build main menu items
   */
  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    const orderSection: MenuItemConfig = {
      id: 'order-management',
      title: 'Rendelések',
      icon: ShoppingCart,
      order: 40,
      permission: 'order',
      children: [
        {
          id: 'orders',
          title: 'Rendelések',
          icon: ShoppingCart,
          path: '/admin/order',
          order: 10,
          permission: 'order',
        },
        {
          id: 'order-statuses',
          title: 'Státuszok',
          icon: BadgeCheck,
          path: '/admin/order-status',
          order: 20,
          permission: 'order',
        },
        {
          id: 'order-payments',
          title: 'Fizetési módok',
          icon: CreditCard,
          path: '/admin/order-payment',
          order: 30,
          permission: 'order',
        },
        {
          id: 'order-shippings',
          title: 'Szállítási módok',
          icon: Truck,
          path: '/admin/order-shipping',
          order: 40,
          permission: 'order',
        }
      ]
    }

    this.addMenuItem(menu, orderSection)

    return menu
  }
}

// Export singleton instance
export const orderMenuBuilder = new OrderMenuBuilder()
