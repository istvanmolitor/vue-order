<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import Button from '@admin/components/ui/button/Button.vue'
import ShowButton from '@admin/components/ui/button/ShowButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import { orderService, type Order } from '../index'
import { toastService } from '@admin/lib/toastService'
import { Plus } from 'lucide-vue-next'

const router = useRouter()
const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})
const search = ref('')
const sort = ref('code')
const direction = ref<'asc' | 'desc'>('desc')

const columns: Column[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'code', label: 'Rendelés kód', sortable: true },
  { key: 'customer', label: 'Ügyfél' },
  { key: 'orderStatus', label: 'Státusz' },
  { key: 'is_closed', label: 'Lezárva', sortable: true },
  { key: 'created_at', label: 'Létrehozva', sortable: true },
]

const displayOrders = computed(() => {
  return orders.value.map(order => ({
    ...order,
    customer: order.customer?.name || '-',
    orderStatus: (order as any)?.orderStatus?.name || '-',
    is_closed: order.is_closed ? 'Igen' : 'Nem',
  }))
})

const fetchOrders = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
} = {}) => {
  loading.value = true
  error.value = null

  try {
    const response = await orderService.getAll({
      page: params.page,
      search: params.search !== undefined ? params.search : (search.value || undefined),
      sort: params.sort ?? sort.value,
      direction: params.direction ?? direction.value,
    })

    orders.value = response.data.data
    pagination.value = response.data.meta
    search.value = params.search ?? search.value
    sort.value = params.sort ?? sort.value
    direction.value = params.direction ?? direction.value
  } catch (err: any) {
    error.value = err.message || 'Hiba történt az adatok betöltése során'
    toastService.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number | undefined) => {
  if (!id) return

  if (confirm('Biztosan törölni szeretné ezt a rendelést?')) {
    try {
      await orderService.delete(id)
      toastService.success('Rendelés sikeresen törölve')
      await fetchOrders({ page: Number(pagination.value.current_page) || 1 })
    } catch (err: any) {
      toastService.error(err.message || 'Hiba történt a törlés során')
    }
  }
}

const navigateToCreate = () => {
  router.push({ name: 'order.create' })
}

const navigateToEdit = (id: number | undefined) => {
  if (id) {
    router.push({ name: 'order.edit', params: { id } })
  }
}

onMounted(() => {
  fetchOrders({ page: 1, sort: 'code', direction: 'desc' })
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Rendelések</h1>
        <Button @click="navigateToCreate" class="gap-2">
          <Plus class="w-4 h-4" />
          Új rendelés
        </Button>
      </div>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle>Rendelések kezelése</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-md text-sm">
            {{ error }}
          </div>

          <DataTable
            :columns="columns"
            :data="displayOrders"
            :loading="loading"
            :pagination="pagination"
            :searchable="true"
            search-placeholder="Keressen rendelés kód vagy ügyfél neve alapján..."
            default-sort="code"
            default-direction="desc"
            @fetch="fetchOrders"
          >
            <template #row-actions="{ row }">
              <div class="flex gap-2">
                <ShowButton @click="router.push({ name: 'order.show', params: { id: row.id } })" />
                <EditButton @click="navigateToEdit(row.id)" />
                <DeleteButton @click="handleDelete(row.id)" />
              </div>
            </template>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

