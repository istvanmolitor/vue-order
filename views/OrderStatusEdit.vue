<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import Input from '@admin/components/ui/Input.vue'
import Label from '@admin/components/ui/Label.vue'
import { toastService } from '@admin/lib/toastService'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'
import { orderStatusService, type OrderStatusFormData } from '../index'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const fetching = ref(true)
const errors = ref<Record<string, string>>({})
const formData = ref<OrderStatusFormData>({
  code: '',
  name: '',
  color: '',
})

const fetchOrderStatus = async () => {
  try {
    const id = route.params.id as string
    const response = await orderStatusService.getEditData(id)
    const orderStatus = response.data.data

    formData.value = {
      code: orderStatus.code,
      name: orderStatus.name,
      color: orderStatus.color || '',
    }
  } catch (err: any) {
    toastService.error(err.message || 'Hiba történt a státusz betöltése során')
  } finally {
    fetching.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    const id = route.params.id as string
    await orderStatusService.update(id, formData.value)
    toastService.success('Státusz sikeresen frissítve')
    router.push({ name: 'order-status.index' })
  } catch (err: any) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      toastService.error(err.message || 'Hiba történt a mentés során')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderStatus()
})
</script>

<template>
  <AdminLayout page-title="Rendelés státusz szerkesztése">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Rendelés státusz szerkesztése</h1>

      <div v-if="fetching" class="py-8 text-center text-muted-foreground"><LoadingSpinner label="Betöltés..." /></div>

      <Card v-else>
        <CardHeader>
          <CardTitle>Státusz adatai</CardTitle>
          <CardDescription>Módosítsa a státusz adatait</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <Label for="code">Kód *</Label>
              <Input id="code" v-model="formData.code" required />
              <FieldError v-if="errors.code" :message="errors.code" />
            </div>

            <div class="space-y-2">
              <Label for="name">Név *</Label>
              <Input id="name" v-model="formData.name" required />
              <FieldError v-if="errors.name" :message="errors.name" />
            </div>

            <div class="space-y-2">
              <Label for="color">Szín</Label>
              <Input id="color" v-model="formData.color" placeholder="#22c55e" />
              <FieldError v-if="errors.color" :message="errors.color" />
            </div>

            <FormButtons
              :loading="loading"
              cancel-text="Vissza"
              submit-text="Mentés"
              @cancel="router.push({ name: 'order-status.index' })"
              @submit="handleSubmit"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
