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
      class="duration-300 btn btn-sm btn-circle btn-outline active:scale-90"
      :class="{ 'btn-disabled text-gray-400 bg-gray-100 border-gray-100': !value }"
      :disabled="!value || value === 0"
      @click="handleOnDecrement"
    >
      <ri-subtract-line class="w-4 h-4" />
    </button>

    <span class="inline-block text-center text-gray-800 w-9">{{ value }}</span>

    <button
      data-increase-button
      tabindex="1"
      type="button"
      class="duration-300 btn btn-sm btn-circle btn-outline active:scale-90"
      :class="{ 'btn-disabled text-gray-400 bg-gray-100 border-gray-100': value === maxValue }"
      :disabled="value === maxValue"
      @click="handleOnIncrement"
    >
      <ri-add-line class="w-4 h-4" />
    </button>
  </div>
</template>
