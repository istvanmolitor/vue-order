<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import ColorPicker from '@admin/components/ui/ColorPicker.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import Input from '@admin/components/ui/Input.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import { normalizeTranslations } from '@language'
import TranslationRepeaterVue from '@language/components/TranslationRepeater.vue'
import { toastService } from '@admin/lib/toastService'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'
import { orderPaymentService, type OrderPaymentFormData } from '../index'

const TranslationRepeater = TranslationRepeaterVue as any

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const fetching = ref(true)
const errors = ref<Record<string, string | string[]>>({})
const formData = ref<OrderPaymentFormData>({
  code: '',
  translations: {},
  color: '',
  price: undefined,
})

const priceInput = computed<string | number | undefined>({
  get: () => formData.value.price,
  set: (value) => {
    if (value === '' || value === undefined) {
      formData.value.price = undefined
      return
    }

    formData.value.price = typeof value === 'number' ? value : Number(value)
  },
})

const fetchOrderPayment = async () => {
  try {
    const id = route.params.id as string
    const response = await orderPaymentService.getEditData(id)
    const orderPayment = response.data.data

    formData.value = {
      code: orderPayment.code,
      translations: normalizeTranslations(orderPayment.translations, ['name', 'description']) as OrderPaymentFormData['translations'],
      color: orderPayment.color || '',
      price: orderPayment.price ?? undefined,
    }
  } catch (err: any) {
    toastService.error(err.message || 'Hiba történt a fizetési mód betöltése során')
  } finally {
    fetching.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    const id = route.params.id as string
    await orderPaymentService.update(id, formData.value)
    toastService.success('Fizetési mód sikeresen frissítve')
    router.push({ name: 'order-payment.index' })
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
  fetchOrderPayment()
})
</script>

<template>
  <AdminLayout page-title="Fizetési mód szerkesztése">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Fizetési mód szerkesztése</h1>
      <div v-if="fetching" class="py-8 text-center text-muted-foreground"><LoadingSpinner label="Betöltés..." /></div>
      <Card v-else>
        <CardHeader>
          <CardTitle>Fizetési mód adatai</CardTitle>
          <CardDescription>Módosítsa a fizetési mód adatait</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <InputField id="code" label="Kód" v-model="formData.code" :required="true" :errors="errors.code" />

            <div class="space-y-2">
              <div class="text-sm font-medium leading-none">Fordítások</div>
              <TranslationRepeater
                :model-value="formData.translations as any"
                :fields="['name', 'description']"
                @update:model-value="(value: any) => formData.translations = value"
              >
                <template #default="{ language, translation }">
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <Label :for="`translation-name-${language.id}`">Név *</Label>
                      <Input :id="`translation-name-${language.id}`" v-model="translation.name" />
                      <FieldError :errors="errors[`translations.${language.id}.name`]" />
                    </div>

                    <div class="space-y-2">
                      <Label :for="`translation-description-${language.id}`">Leírás</Label>
                      <Textarea :id="`translation-description-${language.id}`" v-model="translation.description" rows="3" />
                      <FieldError :errors="errors[`translations.${language.id}.description`]" />
                    </div>
                  </div>
                </template>
              </TranslationRepeater>
              <FieldError :errors="errors.translations" />
            </div>

            <div class="space-y-2">
              <Label for="price">Ár</Label>
              <Input id="price" v-model="priceInput" type="number" min="0" step="0.01" />
              <FieldError :errors="errors.price" />
            </div>

            <div class="space-y-2">
              <Label for="color">Szín</Label>
              <ColorPicker id="color" v-model="formData.color" placeholder="#3b82f6" />
              <FieldError :errors="errors.color" />
            </div>

            <FormButtons
              :loading="loading"
              cancel-text="Vissza"
              submit-text="Mentés"
              @cancel="router.push({ name: 'order-payment.index' })"
              @submit="handleSubmit"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
