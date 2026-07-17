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
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import Checkboxes from '@admin/components/ui/Checkboxes.vue'
import { normalizeTranslations } from '@language'
import TranslationRepeaterVue from '@language/components/TranslationRepeater.vue'
import { toastService } from '@admin/lib/toastService'
import LoadingSpinner from '@admin/components/ui/LoadingSpinner.vue'
import { orderShippingService, type OrderShippingFormData, type OrderPaymentSimple } from '../index'

const TranslationRepeater = TranslationRepeaterVue as any

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const fetching = ref(true)
const errors = ref<Record<string, string | string[]>>({})
const availablePayments = ref<OrderPaymentSimple[]>([])
const formData = ref<OrderShippingFormData>({
  code: '',
  translations: {},
  type: '',
  color: '',
  price: undefined,
  payment_ids: [],
})

const typeInput = computed<string | number | undefined>({
  get: () => formData.value.type ?? '',
  set: (value) => {
    formData.value.type = value === undefined ? '' : String(value)
  },
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

const fetchOrderShipping = async () => {
  try {
    const id = route.params.id as string
    const response = await orderShippingService.getEditData(id)
    const orderShipping = response.data.data

    availablePayments.value = response.data.payments || []

    formData.value = {
      code: orderShipping.code,
      translations: normalizeTranslations(orderShipping.translations, ['name', 'description']) as OrderShippingFormData['translations'],
      type: orderShipping.type || '',
      color: orderShipping.color || '',
      price: orderShipping.price ?? undefined,
      payment_ids: orderShipping.payments?.map((p) => p.id) || [],
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
      <div v-if="fetching" class="py-8 text-center text-muted-foreground"><LoadingSpinner label="Betöltés..." /></div>
      <form v-else class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Szállítási mód adatai</CardTitle>
              <CardDescription>Módosítsa a szállítási mód adatait</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <InputField id="code" label="Kód" v-model="formData.code" :required="true" :errors="errors.code" />

              <InputField id="type" label="Típus" v-model="typeInput" placeholder="simple" :errors="errors.type" />

              <InputField id="price" label="Ár" v-model="priceInput" type="number" min="0" step="0.01" :errors="errors.price" />

              <div class="space-y-2">
                <Label for="color">Szín</Label>
                <ColorPicker id="color" v-model="formData.color" placeholder="#f59e0b" />
                <FieldError :errors="errors.color" />
              </div>

              <Checkboxes
                v-model="formData.payment_ids"
                :items="availablePayments"
                label="Fizetési módok"
                empty-message="Nincsenek elérhető fizetési módok."
                id-prefix="payment"
              />
              <FieldError :errors="errors.payment_ids" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fordítások</CardTitle>
              <CardDescription>Nyelvenkénti elnevezés és leírás</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <TranslationRepeater
                  :model-value="formData.translations as any"
                  #default="{ language, translation }"
                  :fields="['name', 'description']"
                  @update:model-value="(value: any) => formData.translations = value"
                >
                  <div class="space-y-4">
                    <InputField :id="`translation-name-${language.id}`" label="Név" v-model="translation.name" :required="true" :errors="errors[`translations.${language.id}.name`]" />

                    <div class="space-y-2">
                      <Label :for="`translation-description-${language.id}`">Leírás</Label>
                      <Textarea :id="`translation-description-${language.id}`" v-model="translation.description" rows="3" />
                      <FieldError :errors="errors[`translations.${language.id}.description`]" />
                    </div>
                  </div>
                </TranslationRepeater>
                <FieldError :errors="errors.translations" />
              </div>
            </CardContent>
          </Card>
        </div>

        <FormButtons
          :loading="loading"
          cancel-text="Vissza"
          submit-text="Mentés"
          @cancel="router.push({ name: 'order-shipping.index' })"
          @submit="handleSubmit"
        />
      </form>
    </div>
  </AdminLayout>
</template>
