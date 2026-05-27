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
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import DataTablePagination from '@admin/components/ui/dataTable/DataTablePagination.vue'
import DataTableSearch from '@admin/components/ui/dataTable/DataTableSearch.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import { orderService, type Order } from '../index'
import { toastService } from '@admin/lib/toastService'
import { Plus } from 'lucide-vue-next'

const router = useRouter()
const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const sort = ref('code')
const direction = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'code', label: 'Rendelés kód' },
  { key: 'customer', label: 'Ügyfél' },
  { key: 'orderStatus', label: 'Státusz' },
  { key: 'is_closed', label: 'Lezárva' },
  { key: 'created_at', label: 'Létrehozva' },
  { key: 'actions', label: 'Műveletek' },
]

const displayOrders = computed(() => {
  return orders.value.map(order => ({
    ...order,
    customer: order.customer?.name || '-',
    orderStatus: (order as any)?.orderStatus?.name || '-',
    is_closed: order.is_closed ? 'Igen' : 'Nem',
  }))
})

const fetchOrders = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const response = await orderService.getAll({
      page,
      search: search.value || undefined,
      sort: sort.value,
      direction: direction.value,
    })

    orders.value = response.data.data
    currentPage.value = response.data.meta.current_page
    lastPage.value = response.data.meta.last_page
    total.value = response.data.meta.total
  } catch (err: any) {
    error.value = err.message || 'Hiba történt az adatok betöltése során'
    toastService.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchOrders()
}

const handleSort = (column: string) => {
  if (sort.value === column) {
    direction.value = direction.value === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value = column
    direction.value = 'asc'
  }
  currentPage.value = 1
  fetchOrders()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchOrders(page)
}

const handleDelete = async (id: number | undefined) => {
  if (!id) return

  if (confirm('Biztosan törölni szeretné ezt a rendelést?')) {
    try {
      await orderService.delete(id)
      toastService.success('Rendelés sikeresen törölve')
      fetchOrders(currentPage.value)
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
  fetchOrders()
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
          <DataTableSearch
            v-model="search"
            @search="handleSearch"
            placeholder="Keressen rendelés kód vagy ügyfél neve alapján..."
          />

          <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-md text-sm">
            {{ error }}
          </div>

          <DataTable
            :columns="columns"
            :rows="displayOrders"
            :loading="loading"
            @sort="handleSort"
            @row-click="(row) => router.push({ name: 'order.show', params: { id: row.id } })"
          >
            <template #cell-actions="{ row }">
              <div class="flex gap-2">
                <ShowButton @click="router.push({ name: 'order.show', params: { id: row.id } })" />
                <EditButton @click="navigateToEdit(row.id)" />
                <DeleteButton @click="handleDelete(row.id)" />
              </div>
            </template>
          </DataTable>

          <DataTablePagination
            :current-page="currentPage"
            :last-page="lastPage"
            :total="total"
            @page-change="handlePageChange"
          />
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

