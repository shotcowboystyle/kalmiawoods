<script setup lang="ts">
// import { asset } from '@/utils/site';

interface Props {
  title: string;
}

const props = withDefaults(defineProps<Props>(), { title: 'Profile picture' });
</script>

<template>
  <!-- src={asset('images/users/bonnie-green-2x.png')} -->
  <img
    class="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
    src="https://placebeard.it/250/250"
    alt="Jese picture" />
  <div>
    <h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <div class="mb-4 text-sm text-gray-500 dark:text-gray-400">JPG, GIF or PNG. Max size of 800K</div>
    <div class="flex items-center space-x-4">
      <button type="button" class="btn btn-sm">
        <svg class="w-4 h-4 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
          <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
        </svg>
        Upload picture
      </button>

      <button type="button" class="btn btn-sm btn-outline">Delete</button>
    </div>
  </div>
</template>
