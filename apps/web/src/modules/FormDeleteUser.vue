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
      class="mx-auto h-16 w-16 text-error"
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
    <h3 class="base-content py-4">Are you sure you want to delete this user?</h3>
    <button
      class="mr-2 inline-flex btn btn-error"
      @click.prevent="deleteUser">
      Yes, I'm sure
    </button>
    <button
      class="btn btn-ghost"
      @click="handleCloseModal">
      No, cancel
    </button>
  </div>
</template>
