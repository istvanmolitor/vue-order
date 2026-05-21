<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const formData = ref<OrderShippingFormData>({
  code: '',
  name: '',
  type: '',
  color: '',
  price: null,
})

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    await orderShippingService.create(formData.value)
    toastService.success('Szállítási mód sikeresen létrehozva')
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
</script>

<template>
  <AdminLayout page-title="Új szállítási mód">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Új szállítási mód</h1>

      <Card>
        <CardHeader>
          <CardTitle>Szállítási mód adatai</CardTitle>
          <CardDescription>Adja meg az új szállítási mód adatait</CardDescription>
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
              submit-text="Létrehozás"
              @cancel="router.push({ name: 'order-shipping.index' })"
              @submit="handleSubmit"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
