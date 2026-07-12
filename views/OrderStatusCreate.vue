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
import ColorPicker from '@admin/components/ui/ColorPicker.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import TranslationRepeaterVue from '@language/components/TranslationRepeater.vue'
import { toastService } from '@admin/lib/toastService'
import { orderStatusService, type OrderStatusFormData } from '../index'

const TranslationRepeater = TranslationRepeaterVue as any

const router = useRouter()
const loading = ref(false)
const errors = ref<Record<string, string | string[]>>({})
const formData = ref<OrderStatusFormData>({
  code: '',
  translations: {},
  color: '',
})

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  try {
    await orderStatusService.create(formData.value)
    toastService.success('Státusz sikeresen létrehozva')
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
</script>

<template>
  <AdminLayout page-title="Új rendelés státusz">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Új rendelés státusz</h1>

      <Card>
        <CardHeader>
          <CardTitle>Státusz adatai</CardTitle>
          <CardDescription>Adja meg az új státusz adatait</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <InputField id="code" label="Kód" v-model="formData.code" :required="true" :errors="errors.code" />

            <div class="space-y-2">
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
              <Label for="color">Szín</Label>
              <ColorPicker id="color" v-model="formData.color" placeholder="#22c55e" />
              <FieldError :errors="errors.color" />
            </div>

            <FormButtons
              :loading="loading"
              cancel-text="Vissza"
              submit-text="Létrehozás"
              @cancel="router.push({ name: 'order-status.index' })"
              @submit="handleSubmit"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
