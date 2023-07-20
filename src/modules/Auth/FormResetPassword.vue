<script setup lang="ts">
import { HOME, UNEXPECTED_SERVER_ERROR_MESSAGE } from '@/app/constants';
import PasswordStrength from '@/components/PasswordStrength.vue';
import { fetchPost } from '@/utils/fetchClient';

export interface Props {
  token: string;
}

const props = withDefaults(defineProps<Props>(), {
  token: undefined,
});

const toast: { error: Function } | undefined = inject('toast');

const hidePassword = ref(true);
const showPasswordMeter = ref(false);
const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));

const isSubmitting = ref(false);
const formData = reactive({
  newPassword: undefined,
  confirmNewPassword: undefined,
});

async function submit() {
  isSubmitting.value = true;

  try {
    const response = await fetchPost(`password-reset/${props.token}`, { password: formData.newPassword });
    if (response.status === 200) {
      document.location = HOME;
      // location.href = HOME;
    } else {
      toast?.error(UNEXPECTED_SERVER_ERROR_MESSAGE);
    }
  } catch (error: any) {
    toast?.error(error.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <KwForm @submit="submit" class="mt-8 space-y-6">
    <div class="w-full">
      <div class="relative">
        <KwTextField
          class="form-control w-full mb-4"
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
        class="form-control w-full mb-4"
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

    <div class="flex gap-6 justify-start mt-8">
      <KwButton
        variant="primary"
        size="block"
        text="Reset Password"
        type="submit"
        :disabled="isSubmitting"
        :loading="isSubmitting" />
    </div>
  </KwForm>
</template>
