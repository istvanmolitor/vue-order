<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import DataCard from '@admin/components/ui/DataCard.vue'
import BackButton from '@admin/components/ui/button/BackButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import { orderService, type Order } from '../index'
import { toastService } from '@admin/lib/toastService'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchOrder = async () => {
  loading.value = true
  error.value = null
  try {
    const id = route.params.id as string
    const response = await orderService.getById(id)
    order.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Hiba történt az adatok betöltése során'
    toastService.error(error.value!)
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!order.value?.id) return

  if (confirm('Biztosan törölni szeretné ezt a rendelést?')) {
    try {
      await orderService.delete(order.value.id)
      toastService.success('Rendelés sikeresen törölve')
      router.push({ name: 'order.index' })
    } catch (err: any) {
      toastService.error(err.message || 'Hiba történt a törlés során')
    }
  }
}

const navigateToEdit = () => {
  if (order.value?.id) {
    router.push({ name: 'order.edit', params: { id: order.value.id } })
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<template>
  <AdminLayout page-title="Rendelés részletek">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BackButton @click="() => router.push({ name: 'order.index' })" />
          <h1 class="text-3xl font-bold tracking-tight">{{ order?.code || 'Rendelés' }}</h1>
        </div>
        <div class="flex gap-2" v-if="order">
          <EditButton @click="navigateToEdit" />
          <DeleteButton @click="handleDelete" />
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-muted-foreground"><LoadingSpinner label="Betöltés..." /></p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <template v-else-if="order">
        <div class="grid gap-4 md:grid-cols-2">
          <DataCard
            label="Rendelés kód"
            :value="order.code"
          />
          <DataCard label="Ügyfél">
            <RouterLink
              v-if="order.customer"
              :to="{ name: 'customer.customers.edit', params: { id: order.customer.id } }"
              class="text-sm font-medium text-primary hover:underline"
            >
              {{ order.customer.name }}
            </RouterLink>
            <p v-else class="text-sm font-medium text-foreground">-</p>
          </DataCard>
          <DataCard
            label="Státusz"
            :value="order.orderStatus?.name || '-'"
          />
          <DataCard
            label="Lezárva"
            :value="order.is_closed ? 'Igen' : 'Nem'"
          />
          <DataCard
            label="Telefonszám"
            :value="order.phone || '-'"
          />
          <DataCard
            label="Létrehozva"
            :value="order.created_at ? new Date(order.created_at).toLocaleDateString('hu-HU') : '-'"
          />
        </div>

        <Card v-if="order.comment">
          <CardHeader>
            <CardTitle>Megjegyzés</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-700">{{ order.comment }}</p>
          </CardContent>
        </Card>

        <Card v-if="order.internal_comment">
          <CardHeader>
            <CardTitle>Belső megjegyzés</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-700">{{ order.internal_comment }}</p>
          </CardContent>
        </Card>

        <Card v-if="order.orderItems && order.orderItems.length > 0">
          <CardHeader>
            <CardTitle>Rendelés tételei</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2 px-4">Termék</th>
                    <th class="text-left py-2 px-4">Mennyiség</th>
                    <th class="text-right py-2 px-4">Ár</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.orderItems" :key="item.id" class="border-b">
                    <td class="py-2 px-4">
                      <RouterLink
                        v-if="item.product?.id"
                        :to="`/admin/product/${item.product.id}/edit`"
                        class="flex items-center gap-3 hover:bg-muted/40 rounded-md p-1 -m-1 transition-colors"
                      >
                        <img
                          v-if="item.product?.image_url"
                          :src="item.product.image_url"
                          :alt="item.product?.name || item.product?.sku || 'Termékkép'"
                          class="w-12 h-12 rounded object-cover border"
                        />
                        <div
                          v-else
                          class="w-12 h-12 rounded border bg-muted flex items-center justify-center text-[10px] text-muted-foreground"
                        >
                          Nincs kép
                        </div>

                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground truncate">{{ item.product?.sku || '-' }}</p>
                          <p class="font-medium text-sm truncate">{{ item.product?.name || '-' }}</p>
                        </div>
                      </RouterLink>

                      <div v-else class="flex items-center gap-2">
                        <span class="text-muted-foreground">-</span>
                      </div>
                    </td>
                    <td class="py-2 px-4">{{ item.quantity }}</td>
                    <td class="text-right py-2 px-4">{{ item.price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </template>
    </div>
  </AdminLayout>
</template>

