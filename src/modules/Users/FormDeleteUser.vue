<script setup lang="ts">
import { useToast } from 'vue-toastification';

import { UNEXPECTED_SERVER_ERROR_MESSAGE } from '@/app/constants';
import { removeUser } from '@/stores/user';
import { fetchDelete } from '@/utils/fetchClient';

export interface Props {
  userId: string;
  handleCloseModal: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  userId: undefined,
  handleCloseModal: () => {},
});

const toast = useToast();

const isDeleting = ref(false);
async function submit() {
  try {
    const response = await fetchDelete(`admin/users/${props.userId}`);
    if (response.status === 200) {
      removeUser(props.userId);
      props.handleCloseModal();
    } else {
      toast.error(UNEXPECTED_SERVER_ERROR_MESSAGE);
    }
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <div class="p-0 text-center">
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
    <h3 class="base-content pt-4 pb-6 px-12 sm:px-0">Are you sure you want to delete this user?</h3>
    <KwForm @submit="submit" class="space-x-4">
      <KwButton
        v-if="userId"
        variant="danger"
        text="Yes, I'm sure"
        type="submit"
        :disabled="isDeleting"
        :loading="isDeleting" />
      <button class="btn" @click="handleCloseModal">No, cancel</button>
    </KwForm>
  </div>
</template>
