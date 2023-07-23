<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { useToast } from 'vue-toastification';

import { activeUser, activeUserId, updateUser } from '@/stores/user';
import { fetchPost, fetchPut } from '@/utils/fetchClient';

const toast = useToast();

const hidePassword = ref(true);
const showPasswordMeter = ref(false);
const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));
const currentPasswordErrorMessage = ref('');

const $activeUserId = useStore(activeUserId);
const $user = useStore(activeUser);

const isSubmitting = ref(false);
const initFormData = {
  currentPassword: undefined,
  newPassword: undefined,
  confirmNewPassword: undefined,
};
const formData = reactive({ ...initFormData });

async function submit() {
  currentPasswordErrorMessage.value = '';
  isSubmitting.value = true;

  try {
    await fetchPost(`admin/users/${$activeUserId.value}/verify-password`, {
      email: $user.value.email,
      currentPassword: formData.currentPassword,
    });
  } catch (error: any) {
    currentPasswordErrorMessage.value = 'Your current password is incorrect.';
    return;
  } finally {
    isSubmitting.value = false;
  }

  try {
    const updatePasswordResponse = await fetchPut(`admin/users/${$activeUserId.value}/password`, {
      newPassword: formData.newPassword,
    });

    const data = await updatePasswordResponse.json();
    updateUser(data);
    toast.success('Update successful.');
    Object.assign(formData, initFormData);
  } catch (error: any) {
    toast.error(JSON.parse(error).message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <KwForm @submit="submit">
    <KwTextField
      class="form-control w-full md:w-1/2 md:pr-4 mb-4"
      label="Current password"
      name="currentPassword"
      id="currentPassword"
      v-model="formData.currentPassword"
      required
      :type="passwordFieldType"
      :set-invalid-class="currentPasswordErrorMessage?.length > 0"
      autocomplete="off" />
    <div v-if="currentPasswordErrorMessage.length" class="-mt-2 mb-2 text-sm font-normal text-red-600">
      {{ currentPasswordErrorMessage }}
    </div>

    <div class="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-6 mb-4">
      <div class="relative w-full">
        <KwTextField
          class="form-control w-full"
          label="New password"
          name="newPassword"
          id="newPassword"
          v-model="formData.newPassword"
          required
          :rules="['password']"
          :type="passwordFieldType"
          @focus="showPasswordMeter = !showPasswordMeter"
          @blur="showPasswordMeter = !showPasswordMeter"
          autocomplete="off" />
        <div class="absolute top-11 right-2.5">
          <button type="button" class="btn btn-ghost btn-sm" @click="togglePasswordVisibility">
            <span v-if="!hidePassword">Hide</span>
            <span v-else>Show</span>
          </button>
        </div>

        <div
          v-if="showPasswordMeter"
          role="tooltip"
          tabindex="0"
          class="absolute top-24 dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-base-100 text-base-content">
          <div class="card-body">
            <PasswordStrength :password="formData.newPassword" />
          </div>
        </div>
      </div>

      <KwTextField
        class="form-control w-full"
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

    <div class="flex gap-6 justify-end mt-8">
      <KwButton variant="primary" text="Save" type="submit" :disabled="isSubmitting" :loading="isSubmitting" />
    </div>
  </KwForm>
</template>
