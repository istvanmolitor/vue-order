<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StatsCard from '@admin/components/ui/StatsCard.vue'
import { orderService } from '@order/services/orderService'

const orderCount = ref<number | string>('...')

async function loadOrderCount(): Promise<void> {
  try {
    const response = await orderService.getAll({ page: 1 })
    orderCount.value = response.data.meta.total
  } catch {
    orderCount.value = 'N/A'
  }
}

onMounted(() => {
  void loadOrderCount()
})
</script>

<template>
  <StatsCard
    title="Rendelesek"
    :value="orderCount"
    icon="ShoppingCart"
    description="Osszes megrendeles"
  />
</template>

