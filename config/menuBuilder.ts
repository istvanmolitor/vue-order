import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { ShoppingCart } from 'lucide-vue-next'

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
      path: '/admin/order',
      order: 40,
      children: []
    }

    this.addMenuItem(menu, orderSection)

    return menu
  }
}

// Export singleton instance
export const orderMenuBuilder = new OrderMenuBuilder()

