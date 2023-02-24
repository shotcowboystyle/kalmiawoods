<script setup lang="ts">
defineProps<{
  isActive: boolean;
  isDisabled: boolean;
  name: string;
  showSeparator?: boolean;
  onClear: () => void;
}>();
</script>

<template>
  <div class="relative h-8 pr-3" :class="{ 'border-r border-gray-200': showSeparator }">
    <button
      type="button"
      tabindex="0"
      :aria-label="name"
      class="!text-black bg-gray-200 hover:bg-gray-400 !hover:text-black border-0 btn btn-circle btn-sm !h-6 !min-h-0 !w-6 absolute inset-y-0 right-6 translate-y-1/4"
      :class="{
        'opacity-100': isActive && !isDisabled,
        'opacity-0': !isActive,
      }"
      :disabled="isDisabled"
      @click.stop.prevent="onClear"
    >
      <!-- @click.stop.prevent="onClear" -->
      <ri-close-line class="w-4 h-4" />
    </button>
  </div>
</template>
