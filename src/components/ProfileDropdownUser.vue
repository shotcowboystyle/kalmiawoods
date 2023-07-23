<script lang="ts" setup>
import { useStore } from '@nanostores/vue';

import { authUser } from '@/stores/auth';

const $authUser = useStore(authUser);
</script>

<template>
  <div v-if="!$authUser.isLoading" class="px-4 pt-3" role="none">
    <span class="block text-sm text-gray-900 dark:text-white" role="none">
      {{ $authUser.name }}
    </span>
    <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-300" role="none">
      {{ $authUser.email }}
    </span>
  </div>
</template>
