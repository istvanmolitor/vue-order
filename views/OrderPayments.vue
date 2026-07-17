<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Button from '@admin/components/ui/button/Button.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { toastService } from '@admin/lib/toastService'
import { Plus } from 'lucide-vue-next'
import { orderPaymentService, type OrderPayment } from '../index'

const router = useRouter()
const orderPayments = ref<OrderPayment[]>([])
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
const direction = ref<'asc' | 'desc'>('asc')

const columns = ref<Column[]>([])

const fetchOrderPayments = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
} = {}) => {
  loading.value = true
  error.value = null

  try {
    const response = await orderPaymentService.getAll({
      page: params.page,
      search: params.search !== undefined ? params.search : (search.value || undefined),
      sort: params.sort ?? sort.value,
      direction: params.direction ?? direction.value,
    })

    orderPayments.value = response.data.data
    pagination.value = response.data.meta
    columns.value = (response.data.columns ?? []) as Column[]
    search.value = params.search ?? search.value
    sort.value = params.sort ?? sort.value
    direction.value = params.direction ?? direction.value
  } catch (err: any) {
    error.value = err.message || 'Hiba történt a fizetési módok betöltése során'
    toastService.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number | undefined) => {
  if (!id) {
    return
  }

  try {
    await orderPaymentService.delete(id)
    toastService.success('Fizetési mód sikeresen törölve')
    await fetchOrderPayments({ page: pagination.value.current_page })
  } catch (err: any) {
    toastService.error(err.message || 'Hiba történt a törlés során')
  }
}

onMounted(() => {
  fetchOrderPayments({ page: 1, sort: 'code', direction: 'asc' })
})
</script>

<template>
  <AdminLayout page-title="Fizetési módok">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Fizetési módok</h1>
      </div>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle>Fizetési módok kezelése</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="error" class="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {{ error }}
          </div>

          <DataTable
            :columns="columns"
            :data="orderPayments"
            :loading="loading"
            :pagination="pagination"
            :searchable="true"
            search-placeholder="Keresés kód vagy név alapján..."
            default-sort="code"
            default-direction="asc"
            @fetch="fetchOrderPayments"
          >
            <template #actions>
              <Button class="gap-2" @click="router.push({ name: 'order-payment.create' })">
                <Plus class="h-4 w-4" />
                Új fizetési mód
              </Button>
            </template>
            <template #cell-price="{ row }">
              {{ row.price ?? '-' }}
            </template>
            <template #cell-color="{ row }">
              {{ row.color || '-' }}
            </template>
            <template #row-actions="{ row }">
              <div class="flex items-center gap-2">
                <EditButton @click="router.push({ name: 'order-payment.edit', params: { id: row.id } })" />
                <DeleteButton @confirm="handleDelete(row.id)" />
              </div>
            </template>
            <template #empty>
              Nincs megjeleníthető fizetési mód.
            </template>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
