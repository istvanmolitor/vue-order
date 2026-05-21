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
import { orderShippingService, type OrderShippingFormData } from '../index'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const fetching = ref(true)
const errors = ref<Record<string, string>>({})
const formData = ref<OrderShippingFormData>({
  code: '',
  name: '',
  type: '',
  color: '',
  price: null,
})

const fetchOrderShipping = async () => {
  try {
    const id = route.params.id as string
    const response = await orderShippingService.getEditData(id)
    const orderShipping = response.data.data

    formData.value = {
      code: orderShipping.code,
      name: orderShipping.name,
      type: orderShipping.type || '',
      color: orderShipping.color || '',
      price: orderShipping.price ?? null,
    }
  } catch (err: any) {
    toastService.error(err.message || 'Hiba történt a szállítási mód betöltése során')
  } finally {
    fetching.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    const id = route.params.id as string
    await orderShippingService.update(id, formData.value)
    toastService.success('Szállítási mód sikeresen frissítve')
    router.push({ name: 'order-shipping.index' })
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
  fetchOrderShipping()
})
</script>

<template>
  <AdminLayout page-title="Szállítási mód szerkesztése">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Szállítási mód szerkesztése</h1>

      <div v-if="fetching" class="py-8 text-center text-muted-foreground">
        Betöltés...
      </div>

      <Card v-else>
        <CardHeader>
          <CardTitle>Szállítási mód adatai</CardTitle>
          <CardDescription>Módosítsa a szállítási mód adatait</CardDescription>
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
              <Label for="type">Típus</Label>
              <Input id="type" v-model="formData.type" placeholder="simple" />
              <FieldError v-if="errors.type" :message="errors.type" />
            </div>

            <div class="space-y-2">
              <Label for="price">Ár</Label>
              <Input id="price" v-model.number="formData.price" type="number" min="0" step="0.01" />
              <FieldError v-if="errors.price" :message="errors.price" />
            </div>

            <div class="space-y-2">
              <Label for="color">Szín</Label>
              <Input id="color" v-model="formData.color" placeholder="#f59e0b" />
              <FieldError v-if="errors.color" :message="errors.color" />
            </div>

            <FormButtons
              :loading="loading"
              cancel-text="Vissza"
              submit-text="Mentés"
              @cancel="router.push({ name: 'order-shipping.index' })"
              @submit="handleSubmit"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
