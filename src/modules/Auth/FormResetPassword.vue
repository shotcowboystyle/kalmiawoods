<script setup lang="ts">
import { HOME } from '@/app/constants';
// import PasswordStrength from '@/components/PasswordStrength.vue';

const props = defineProps({
  token: String,
});

const hasErrors = ref(false);
const errorMessage = ref('');
const confirmPasswordErrorMessage = ref('');
const hidePassword = ref(true);
const showPasswordMeter = ref(false);
const isSubmitting = ref(false);
const formData = reactive({
  password: '',
  confirmPassword: '',
});

const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));

function invalidateForm() {
  hasErrors.value = true;
}

async function submit() {
  isSubmitting.value = true;

  const response = await fetch(`/api/password-reset/${props.token}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: formData.password }),
  });

  if (response.status !== 200) {
    const data = await response.json();
    errorMessage.value = data.message;
  } else {
    location.href = HOME;
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="mt-8 space-y-6" :class="[{ errors: hasErrors }]">
    <div class="form-control w-full max-w-xs">
      <label class="label" for="password">
        <span class="label-text">New password</span>
      </label>
      <input
        v-model="formData.password"
        class="input input-bordered w-full max-w-xs"
        type="password"
        name="password"
        id="password"
        placeholder="name@company.com"
        required />
      <div class="absolute bottom-2.5 right-2.5">
        <button type="button" class="btn btn-primary" @click="togglePasswordVisibility">Show</button>
      </div>
      <p class="text-error text-sm" v-if="errorMessage.length">{{ errorMessage }}</p>
      <div
        data-popover
        id="popover-password"
        role="tooltip"
        class="absolute z-10 inline-block w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 shadow-sm transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
        :class="[{ 'invisible opacity-0': !showPasswordMeter }]">
        <PasswordStrength :password="formData.password" />
      </div>
    </div>

    <div class="form-control w-full max-w-xs">
      <label class="label" for="confirm-password">
        <span class="label-text">Confirm password</span>
      </label>
      <input
        v-model="formData.confirmPassword"
        class="input input-bordered w-full max-w-xs"
        type="confirm-password"
        name="confirm-password"
        id="confirm-password"
        placeholder="name@company.com"
        required />
      <p class="text-error text-sm" v-if="confirmPasswordErrorMessage.length">{{ confirmPasswordErrorMessage }}</p>
    </div>

    <div class="flex flex-wrap items-start">
      <a href="/auth/password-reset" class="link text-primary"> Lost Password? </a>
    </div>

    <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="loading loading-spinner"></span>
      <span v-else>Login</span>
    </button>
  </form>
</template>
