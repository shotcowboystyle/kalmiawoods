<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();

console.log('SHOW', props.show);
</script>

<template>
  <div class="absolute dropdown-toggle" :class="{ hidden: !show }">
    <slot />
  </div>
</template>
