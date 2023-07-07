<script setup lang="ts">
import { activeUserId, removeUser } from '@/stores/user';
import { useStore } from '@nanostores/vue';

export interface Props {
  handleCloseModal: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  handleCloseModal: () => {},
});

const $userId = useStore(activeUserId);

async function deleteUser() {
  const response = await fetch('/api/users', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: $userId.value }),
  });

  if (response.status === 200) {
    removeUser($userId.value);
    props.handleCloseModal();
  }
}
</script>

<template>
  <div class="p-6 pt-0 text-center">
    <svg
      class="mx-auto h-16 w-16 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <h3 class="mb-6 mt-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete this user?</h3>
    <button
      class="mr-2 inline-flex items-center rounded-lg bg-red-600 px-3 py-2.5 text-center text-base font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
      @click.prevent="deleteUser">
      Yes, I'm sure
    </button>
    <button
      class="focus:ring-primary-300 inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
      @click="handleCloseModal">
      No, cancel
    </button>
  </div>
</template>
