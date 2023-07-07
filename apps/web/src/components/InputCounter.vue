<script setup lang="ts">
defineProps<{
  // guestType?: string;
  value: number;
  maxValue?: number;
  handleOnIncrement: () => void;
  handleOnDecrement: () => void;
}>();
</script>

<template>
  <div class="flex items-center">
    <button
      data-decrease-button
      tabindex="0"
      type="button"
      class="btn btn-sm btn-circle btn-outline"
      :class="{ 'btn-disabled': value === 0 }"
      :disabled="!value || value === 0"
      @click="handleOnDecrement">
      <ri-subtract-line class="h-4 w-4" />
    </button>

    <span class="inline-block w-9 text-center text-gray-800">{{ value }}</span>

    <button
      data-increase-button
      tabindex="0"
      type="button"
      class="btn btn-sm btn-circle btn-outline"
      :class="{ 'btn-disabled': value === maxValue }"
      :disabled="value === maxValue"
      @click="handleOnIncrement">
      <ri-add-line class="h-4 w-4" />
    </button>
  </div>
</template>
