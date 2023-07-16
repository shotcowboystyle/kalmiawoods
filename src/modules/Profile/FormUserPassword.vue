<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import { authUser } from '@/stores/auth';
import { activeUserId, updateUser } from '@/stores/user';
import { fetchPut } from '@/utils/fetchClient';

const toast: { error: Function; success: Function } | undefined = inject('toast');

const hidePassword = ref(true);
const showPasswordMeter = ref(false);
const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));

const $authUser = useStore(authUser);
const $activeUserId = useStore(activeUserId);

const isSubmitting = ref(false);
const formData = reactive({
  currentPassword: undefined,
  newPassword: undefined,
  confirmNewPassword: undefined,
});

async function submit() {
  isSubmitting.value = true;

  try {
    const response = await fetchPut(`users/${$activeUserId.value}/password`, {
      newPassword: formData.newPassword,
    });

    const data = await response.json();
    updateUser(data);
    toast?.success('Update successful.');
  } catch (error) {
    console.log('error', error);
    toast?.error(error.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <KwForm @submit="submit">
    <div class="form-control w-full max-w-xs mb-4">
      <KwTextField
        class="form-control w-full max-w-xs"
        label="Current password"
        name="currentPassword"
        id="currentPassword"
        v-model="formData.currentPassword"
        required
        :type="passwordFieldType"
        autocomplete="off" />
    </div>

    <div class="flex gap-x-6 mb-4">
      <div class="form-control w-full max-w-xs">
        <KwTextField
          class="form-control w-full max-w-xs"
          label="New password"
          name="newPassword"
          id="newPassword"
          v-model="formData.newPassword"
          required
          :rules="['password']"
          :type="passwordFieldType"
          autocomplete="off" />
        <div class="absolute bottom-2.5 right-2.5">
          <button type="button" class="btn btn-primary" @click="togglePasswordVisibility">Show</button>
        </div>
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
        <KwTextField
          class="form-control w-full max-w-xs"
          label="Confirm new password"
          name="confirmNewPassword"
          id="confirmNewPassword"
          v-model="formData.confirmNewPassword"
          required
          :rules="['isMatch']"
          :validation-match="formData.newPassword"
          errorMessagePrefix="Passwords"
          :type="passwordFieldType"
          autocomplete="off" />
      </div>
    </div>

    <div class="flex gap-6 justify-start mt-8">
      <KwButton
        variant="primary"
        text="Save"
        icon-right="arrow-right"
        type="submit"
        :disabled="isSubmitting"
        :loading="isSubmitting" />
    </div>
  </KwForm>
</template>
