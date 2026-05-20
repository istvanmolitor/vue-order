<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Label from '@admin/components/ui/Label.vue'
import Select from '@admin/components/ui/Select.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { orderService, type OrderFormData, type OrderStatus } from '../index'
import { toastService } from '@admin/lib/toastService'

const router = useRouter()
const loading = ref(false)
const orderStatuses = ref<OrderStatus[]>([])
const formData = ref<OrderFormData>({
  customer_id: 0,
  order_status_id: 0,
  is_closed: false,
  comment: '',
  internal_comment: '',
  phone: '',
})
const errors = ref<Record<string, string>>({})

const fetchFormData = async () => {
  try {
    const response = await orderService.getCreateData()
    orderStatuses.value = response.data.order_statuses || []
  } catch (err: any) {
    toastService.error('Hiba történt az adatok betöltése során')
  }
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    await orderService.create(formData.value)
    toastService.success('Rendelés sikeresen létrehozva')
    router.push({ name: 'order.index' })
  } catch (err: any) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      toastService.error(err.message || 'Hiba történt az mentés során')
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'order.index' })
}

onMounted(() => {
  fetchFormData()
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Új rendelés létrehozása</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rendelés adatai</CardTitle>
          <CardDescription>Adja meg az új rendelés adatait</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="customer_id">Ügyfél *</Label>
                <Input
                  id="customer_id"
                  v-model.number="formData.customer_id"
                  type="number"
                  placeholder="Ügyfél ID"
                  required
                />
                <FieldError v-if="errors.customer_id" :message="errors.customer_id" />
              </div>

              <div class="space-y-2">
                <Label for="order_status_id">Státusz *</Label>
                <Select
                  v-model.number="formData.order_status_id"
                  id="order_status_id"
                  required
                >
                  <option value="">Válasszon státuszt</option>
                  <option
                    v-for="status in orderStatuses"
                    :key="status.id"
                    :value="status.id"
                  >
                    {{ status.name }}
                  </option>
                </Select>
                <FieldError v-if="errors.order_status_id" :message="errors.order_status_id" />
              </div>

              <div class="space-y-2">
                <Label for="phone">Telefonszám</Label>
                <Input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  placeholder="+36 1 234 5678"
                />
                <FieldError v-if="errors.phone" :message="errors.phone" />
              </div>

              <div class="space-y-2">
                <Label for="is_closed" class="flex items-center gap-2">
                  <input
                    id="is_closed"
                    v-model="formData.is_closed"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                  Lezárva
                </Label>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="comment">Megjegyzés</Label>
              <textarea
                id="comment"
                v-model="formData.comment"
                placeholder="Rendeléshez kapcsolódó megjegyzés"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
              <FieldError v-if="errors.comment" :message="errors.comment" />
            </div>

            <div class="space-y-2">
              <Label for="internal_comment">Belső megjegyzés</Label>
              <textarea
                id="internal_comment"
                v-model="formData.internal_comment"
                placeholder="Belső megjegyzés (nem látható az ügyfél számára)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
              <FieldError v-if="errors.internal_comment" :message="errors.internal_comment" />
            </div>

            <FormButtons
              @submit="handleSubmit"
              @cancel="handleCancel"
              :loading="loading"
              submit-text="Létrehozás"
              cancel-text="Vissza"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

