<script setup lang="ts">
export interface Props {
  token: string;
}

const props = withDefaults(defineProps<Props>(), {
  token: '',
});

const errorMessage = ref('');
const passwordErrorMessage = ref('');
const confirmPasswordErrorMessage = ref('');
const hidePassword = ref(true);
const showPasswordMeter = ref(false);
const password = ref('');
const confirmPassword = ref('');
const passwordLength = ref(0);
const containsEightCharacters = ref(false);
const containsNumber = ref(false);
const containsUppercase = ref(false);
const containsLowercase = ref(false);
const containsSpecialCharacter = ref(false);
const validPassword = ref(false);
const validConfirmPassword = ref(false);

const checkPassword = () => {
  passwordLength.value = password.value.length;
  const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (passwordLength.value > 8) {
    containsEightCharacters.value = true;
  } else {
    containsEightCharacters.value = false;
  }

  containsNumber.value = /\d/.test(password.value);
  containsUppercase.value = /[A-Z]/.test(password.value);
  containsLowercase.value = /[a-z]/.test(password.value);
  containsSpecialCharacter.value = format.test(password.value);

  if (
    containsEightCharacters.value === true &&
    containsSpecialCharacter.value === true &&
    containsUppercase.value === true &&
    containsLowercase.value === true &&
    containsNumber.value === true
  ) {
    validPassword.value = true;
    passwordErrorMessage.value = '';
  } else {
    validPassword.value = false;
    passwordErrorMessage.value = 'Password does not meet requirements';
  }
};

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

  const response = await fetch(`/api/complete-registration/${props.token}`, {
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
            @input="checkPassword"
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
        <div class="space-y-2 p-3">
          <h3 class="font-semibold text-gray-900 dark:text-white">Must have at least 8 characters</h3>
          <div class="grid grid-cols-4 gap-2">
            <div
              class="h-1 bg-gray-200 dark:bg-gray-600"
              :class="[
                { 'bg-orange-300 dark:bg-orange-400': containsLowercase && containsUppercase && !validPassword },
                { 'bg-green-200 dark:bg-green-600': validPassword },
              ]"></div>
            <div
              class="h-1 bg-gray-200 dark:bg-gray-600"
              :class="[
                { 'bg-orange-300 dark:bg-orange-400': containsNumber && !validPassword },
                { 'bg-green-200 dark:bg-green-600': validPassword },
              ]"></div>
            <div
              class="h-1 bg-gray-200 dark:bg-gray-600"
              :class="[
                { 'bg-orange-300 dark:bg-orange-400': containsSpecialCharacter && !validPassword },
                { 'bg-green-200 dark:bg-green-600': validPassword },
              ]"></div>
            <div
              class="h-1 bg-gray-200 dark:bg-gray-600"
              :class="[{ 'bg-green-200 dark:bg-green-600': validPassword }]"></div>
          </div>
          <p>It’s better to have:</p>
          <ul>
            <li class="mb-1 flex items-center">
              <svg
                v-if="containsLowercase && containsUppercase"
                class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg
                v-else
                class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
              Upper & lower case letters
            </li>
            <li class="mb-1 flex items-center">
              <svg
                v-if="containsSpecialCharacter"
                class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg
                v-else
                class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
              A special character (!, @, #, $, %,, &, or *)
            </li>
            <li class="mb-1 flex items-center">
              <svg
                v-if="containsNumber"
                class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg
                v-else
                class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
              A number
            </li>
            <li class="flex items-center">
              <svg
                v-if="containsEightCharacters"
                class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg
                v-else
                class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
              A longer password (min. 8 chars.)
            </li>
          </ul>
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
