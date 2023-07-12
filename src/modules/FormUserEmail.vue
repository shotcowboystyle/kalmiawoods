<script setup lang="ts">
import { updateUser, user } from '@/stores/user';
import { useStore } from '@nanostores/vue';
import { useTimeout } from '@vueuse/core';

const props = defineProps({
  userId: {
    type: String,
    default: 'latest',
  },
});

const $user = useStore(user);

const showToast = ref(false);
const { ready, start } = useTimeout(3500, { controls: true, callback: () => (showToast.value = false) });

const isSubmitting = ref(false);
const isSubmitSuccess = ref(false);
const isSubmitFailure = ref(false);
const hasErrors = ref(false);
const formData = reactive({
  newEmail: undefined,
});

function invalidateForm() {
  hasErrors.value = true;
}

async function submit() {
  isSubmitSuccess.value = false;
  isSubmitFailure.value = false;
  isSubmitting.value = true;

  try {
    const response = await fetch(`/api/users/${props.userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updateUserType: 'AUTH_CREDENTIALS', ...formData }),
    });

    if (response.status === 200) {
      isSubmitSuccess.value = true;
      const data = await response.json();
      updateUser(data);
    }
  } catch {
    isSubmitFailure.value = true;
  } finally {
    isSubmitting.value = false;
    showToast.value = true;
    start();
  }
}
</script>

<template>
  <form @submit.prevent="submit" :class="[{ errors: hasErrors }]">
    <p>Current email: {{ $user.email }}</p>
    <div class="form-control w-full max-w-xs mb-4">
      <label class="label" for="newEmail">
        <span class="label-text">New email <span class="text-error">*</span></span>
      </label>
      <input
        v-model="formData.newEmail"
        class="input input-bordered w-full max-w-xs"
        type="email"
        autocomplete="off"
        name="newEmail"
        id="newEmail"
        @invalid="invalidateForm"
        required />
    </div>

    <div class="mt-8">
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="loading loading-spinner"></span>
        <span v-else>Save</span>
      </button>
    </div>
  </form>

  <div v-if="showToast" class="toast toast-top toast-center z-50">
    <div class="alert" :class="[{ 'alert-error': isSubmitFailure }, { 'alert-success': isSubmitSuccess }]">
      <span v-if="isSubmitFailure">There was an error updating this user's email.</span>
      <span v-else>User email successfully updated.</span>
    </div>
  </div>
</template>
