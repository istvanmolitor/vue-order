<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
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
import TranslationRepeaterVue from '@language/components/TranslationRepeater.vue'
import { toastService } from '@admin/lib/toastService'
import { orderPaymentService, type OrderPaymentFormData, type OrderShippingSimple } from '../index'

const TranslationRepeater = TranslationRepeaterVue as any

const router = useRouter()
const loading = ref(false)
const errors = ref<Record<string, string | string[]>>({})
const availableShippings = ref<OrderShippingSimple[]>([])
const formData = ref<OrderPaymentFormData>({
  code: '',
  translations: {},
  color: '',
  price: undefined,
  shipping_ids: [],
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

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    await orderPaymentService.create(formData.value)
    toastService.success('Fizetési mód sikeresen létrehozva')
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

onMounted(async () => {
  try {
    const response = await orderPaymentService.getCreateData()
    availableShippings.value = response.data.shippings || []
  } catch (err: any) {
    toastService.error(err.message || 'Hiba történt az adatok betöltése során')
  }
})
</script>

<template>
  <AdminLayout page-title="Új fizetési mód">
    <div class="space-y-6">
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fizetési mód adatai</CardTitle>
              <CardDescription>Adja meg az új fizetési mód adatait</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <InputField id="code" label="Kód" v-model="formData.code" :required="true" :errors="errors.code" />

              <InputField id="price" label="Ár" v-model="priceInput" type="number" min="0" step="0.01" :errors="errors.price" />

              <div class="space-y-2">
                <Label for="color">Szín</Label>
                <ColorPicker id="color" v-model="formData.color" placeholder="#3b82f6" />
                <FieldError :errors="errors.color" />
              </div>

              <Checkboxes
                v-model="formData.shipping_ids"
                :items="availableShippings"
                label="Szállítási módok"
                empty-message="Nincsenek elérhető szállítási módok."
                id-prefix="shipping"
              />
              <FieldError :errors="errors.shipping_ids" />
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
          submit-text="Létrehozás"
          @cancel="router.push({ name: 'order-payment.index' })"
          @submit="handleSubmit"
        />
      </form>
    </div>
  </AdminLayout>
</template>
