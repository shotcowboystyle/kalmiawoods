<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import { activeUser, activeUserId, updateUser } from '@/stores/user';
import { fetchPost, fetchPut } from '@/utils/fetchClient';

const toast: { error: Function; success: Function } | undefined = inject('toast');

const hidePassword = ref(true);
const showPasswordMeter = ref(false);
const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));
const currentPasswordErrorMessage = ref('');

const $activeUserId = useStore(activeUserId);
const $user = useStore(activeUser);

const isSubmitting = ref(false);
const formData = reactive({
  currentPassword: undefined,
  newPassword: undefined,
  confirmNewPassword: undefined,
});

async function submit() {
  currentPasswordErrorMessage.value = '';
  isSubmitting.value = true;

  try {
    const currentPasswordCheck = await fetchPost(`users/${$activeUserId.value}/password`, {
      email: $user.value.email,
      currentPassword: formData.currentPassword,
    });

    if (currentPasswordCheck.status !== 200) {
      currentPasswordErrorMessage.value = 'Your current password is incorrect.';
      return;
    }

    const updatePasswordResponse = await fetchPut(`users/${$activeUserId.value}/password`, {
      newPassword: formData.newPassword,
    });

    const data = await updatePasswordResponse.json();
    updateUser(data);
    toast?.success('Update successful.');
  } catch (error: any) {
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
      <!-- :invalid="currentPasswordErrorMessage" -->
      <div v-if="currentPasswordErrorMessage.length" class="mt-2 text-sm font-normal text-red-600">
        {{ currentPasswordErrorMessage }}
      </div>
    </div>

    <div class="flex gap-x-6 mb-4">
      <div class="form-control w-full max-w-xs relative">
        <KwTextField
          class="form-control w-full max-w-xs"
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
      <KwButton variant="primary" text="Save" type="submit" :disabled="isSubmitting" :loading="isSubmitting" />
    </div>
  </KwForm>
</template>
