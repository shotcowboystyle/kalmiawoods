<script setup lang="ts">
import { useTimeout } from '@vueuse/core';

const props = defineProps({
  userId: {
    type: String,
    default: 'latest',
  },
});

const showToast = ref(false);
const { ready, start } = useTimeout(3500, { controls: true, callback: () => (showToast.value = false) });

const hidePassword = ref(true);
const showPasswordMeter = ref(false);
const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));

const isSubmitting = ref(false);
const isSubmitSuccess = ref(false);
const isSubmitFailure = ref(false);
const hasErrors = ref(false);
const passwordErrorMessage = ref('');
const confirmPasswordErrorMessage = ref('');
const formData = reactive({
  currentPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
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
      body: JSON.stringify({ updateUserType: 'SECURITY_CREDENTIALS', newPassword: formData.newPassword }),
    });

    if (response.status === 200) {
      isSubmitSuccess.value = true;
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
    <div class="form-control w-full max-w-xs mb-4">
      <label class="label" for="currentPassword">
        <span class="label-text">Current password <span class="text-error">*</span></span>
      </label>
      <input
        v-model="formData.currentPassword"
        class="input input-bordered w-full max-w-xs"
        :type="passwordFieldType"
        autocomplete="off"
        name="currentPassword"
        id="currentPassword"
        @invalid="invalidateForm"
        required />
    </div>

    <div class="flex gap-x-6 mb-4">
      <div class="form-control w-full max-w-xs">
        <label class="label" for="newPassword">
          <span class="label-text">New password</span>
        </label>
        <input
          v-model="formData.newPassword"
          class="input input-bordered w-full max-w-xs"
          :type="passwordFieldType"
          autocomplete="off"
          name="newPassword"
          id="newPassword"
          required />
        <div class="absolute bottom-2.5 right-2.5">
          <button type="button" class="btn btn-primary" @click="togglePasswordVisibility">Show</button>
        </div>
        <p class="text-error text-sm" v-if="passwordErrorMessage.length">{{ passwordErrorMessage }}</p>
        <div
          data-popover
          id="popover-password"
          role="tooltip"
          class="absolute z-10 inline-block w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 shadow-sm transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
          :class="[{ 'invisible opacity-0': !showPasswordMeter }]">
          <PasswordStrength :password="formData.newPassword" />
        </div>
      </div>

      <div class="form-control w-full max-w-xs">
        <label class="label" for="confirmPassword">
          <span class="label-text">Confirm password</span>
        </label>
        <input
          v-model="formData.confirmPassword"
          class="input input-bordered w-full max-w-xs"
          :type="passwordFieldType"
          autocomplete="off"
          name="confirmPassword"
          id="confirmPassword"
          required />
        <p class="text-error text-sm" v-if="confirmPasswordErrorMessage.length">{{ confirmPasswordErrorMessage }}</p>
      </div>
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
      <span v-if="isSubmitFailure">There was an error updating this user's password.</span>
      <span v-else>User password successfully updated.</span>
    </div>
  </div>
</template>
