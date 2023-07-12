<script setup lang="ts">
import { HOME } from '@/app/constants';
import PasswordStrength from '@/components/PasswordStrength.vue';

const props = defineProps({
  token: {
    type: String,
    default: '',
  },
});

const errorMessage = ref('');
const passwordErrorMessage = ref('');
const confirmPasswordErrorMessage = ref('');
const hidePassword = ref(true);
const showPasswordMeter = ref(false);
const password = ref('');
const confirmPassword = ref('');
const validPassword = ref(false);
const validConfirmPassword = ref(false);

const checkConfirmPassword = () => {
  if (confirmPassword.value === password.value) {
    validConfirmPassword.value = true;
    confirmPasswordErrorMessage.value = '';
  } else {
    validConfirmPassword.value = false;
    confirmPasswordErrorMessage.value = "Passwords don't match";
  }
};

async function submit(e: Event) {
  e.preventDefault();

  const response = await fetch(`/api/email-verification/${props.token}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: password.value }),
  });

  if (response.status !== 200) {
    const data = await response.json();
    errorMessage.value = data.message;
  } else {
    document.location = HOME;
  }
}

const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));
</script>

<template>
  <form @submit="submit">
    <div class="w-full">
      <div class="form-control w-full">
        <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" for="password">
          <span class="label-text">Password</span>
        </label>
        <div class="relative flex">
          <input
            v-model="password"
            name="password"
            id="password"
            autocomplete="off"
            placeholder="create a password"
            data-popover-target="popover-password"
            data-popover-placement="bottom"
            @focus="showPasswordMeter = true"
            @blur="showPasswordMeter = false"
            required
            :type="passwordFieldType"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" />
          <div class="absolute bottom-2.5 right-2.5">
            <button type="button" class="btn btn-primary" @click="togglePasswordVisibility">Show</button>
          </div>
          <p class="text-error text-sm" v-if="passwordErrorMessage.length">{{ passwordErrorMessage }}</p>
        </div>
      </div>
      <div
        data-popover
        id="popover-password"
        role="tooltip"
        class="absolute z-10 inline-block w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 shadow-sm transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
        :class="[{ 'invisible opacity-0': !showPasswordMeter }]">
        <PasswordStrength :password="password" />
      </div>
    </div>
    <div class="form-control w-full">
      <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" for="confirm-password">
        <span class="label-text">Confirm password</span>
      </label>
      <div class="relative flex">
        <input
          v-model="confirmPassword"
          name="confirm-password"
          id="confirm-password"
          placeholder="re-type a password"
          @input="checkConfirmPassword"
          required
          :type="passwordFieldType"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" />
      </div>
      <p class="text-error text-sm" v-if="confirmPasswordErrorMessage.length">{{ confirmPasswordErrorMessage }}</p>
    </div>

    <div class="items-center rounded-b border-t border-gray-200 p-6 dark:border-gray-700">
      <div class="mt-8 text-right">
        <button
          type="submit"
          class="btn btn-primary rounded-lg border"
          :class="[{ 'btn-disabled': !(validPassword && validConfirmPassword) }]"
          :disabled="!(validPassword && validConfirmPassword)">
          Complete registration
        </button>
      </div>
    </div>
  </form>
</template>
