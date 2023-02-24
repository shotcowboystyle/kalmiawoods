<script setup lang="ts">
import { useTheme } from '../../composables/useTheme';
const { isDark } = useTheme();
</script>

<template>
  <label class="p-2 swap btn-ghost swap-rotate btn">
    <input v-model="isDark" type="checkbox" class="invisible" />
    <ri-sun-fill class="w-6 h-6 text-yellow-400 fill-current swap-on" />
    <ri-moon-clear-fill class="w-6 h-6 text-current fill-current swap-off" />
    <!-- size="2rem" -->
  </label>
</template>
