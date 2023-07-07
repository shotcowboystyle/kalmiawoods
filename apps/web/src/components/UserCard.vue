<template>
  <a :href="route(`users/${data.id}`)" class="group">
    <!-- <img
      :src="`${resourcePath}/users/${data.coverImg}`"
      alt="image"
      class="object-cover h-full max-w-full duration-500 ease-in-out group-hover:scale-110"
      @load="$emit('load', $event)"
    /> -->
    <div class="absolute h-full w-full bg-black opacity-10 transition-opacity duration-500 group-hover:opacity-50" />
    <p class="absolute bottom-0 w-full rounded-b-lg p-2 text-sm text-gray-700 backdrop-blur-lg backdrop-opacity-75">
      {{ data.email }}
    </p>
  </a>
</template>

<script lang="ts" setup>
import type { User } from '@/types/user';

// import { resourcePath } from '@/pages/_common'
import { route } from '@/stores/routes';

interface Props {
  data: User;
}
defineProps<Props>();

interface Emits {
  (e: 'load', ev: Event): void;
}
const emit = defineEmits<Emits>();
</script>
