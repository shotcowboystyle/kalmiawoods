<script setup lang="ts">
defineProps({
  text: String,
  loading: Boolean,
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'base',
  },
  iconLeft: [String, Array],
  iconRight: [String, Array],
});

const variants: {
  neutral: string;
  primary: string;
  secondary: string;
  accent: string;
  ghost: string;
  link: string;
} = {
  neutral: 'btn-neutral',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  link: 'btn-link',
};

const sizes: { xs: string; sm: string; lg: string; base: string; responsive: string } = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  lg: 'btn-lg',
  base: '',
  responsive: 'btn-xs sm:btn-sm md:btn-md lg:btn-lg',
};
</script>

<template>
  <button type="button" class="btn" :class="[variants[variant], sizes[size]]">
    <KwSpinner class="h-4 w-4 border-[2px]" v-if="loading && !iconRight" />
    <!-- <font-awesome-icon v-else-if="iconLeft" class="text-base" :icon="iconLeft" /> -->
    <span v-if="text"> {{ text }}</span>
    <KwSpinner class="h-4 w-4 border-[2px]" v-if="loading && iconRight" />
    <!-- <font-awesome-icon v-else-if="iconRight" class="text-base" :icon="iconRight" /> -->
  </button>
</template>
