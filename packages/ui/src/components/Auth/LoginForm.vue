<template>
  <div class="flex flex-col items-center justify-center w-full px-6 pt-8 mx-auto pt:mt-0 dark:bg-gray-900">
    <a href="#" class="flex items-center justify-center mb-8 text-2xl font-semibold dark:text-white lg:mb-10">
      <span>Kalmia Woods</span>
    </a>

    <div class="w-full max-w-xl p-6 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Sign in to platform</h2>
      <!-- <form class="mt-8 space-y-6" action="#"> -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <input
            v-model="loginForm.email"
            type="email"
            name="email"
            id="email"
            class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:bosrder-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
            placeholder="name@company.com"
            required
          />
        </div>
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Your password</label
          >
          <input
            v-model="loginForm.password"
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
            required
          />
        </div>
        <!-- <p v-if="error" class="mt-4 text-sm text-gray-300">
          {{ error }}
        </p> -->
        <div class="flex flex-wrap items-start">
          <div class="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              name="remember"
              type="checkbox"
              class="w-4 h-4 border-gray-300 rounded focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="remember" class="font-medium text-gray-900 dark:text-white"> Remember me </label>
          </div>
          <a
            href="#"
            class="w-full mt-4 ml-auto text-sm text-left text-primary-700 dark:text-primary-500 hover:underline"
          >
            Lost Password?
          </a>
        </div>
        <!-- <button class="w-full btn-primary btn" @click="login">Login to your account</button> -->
        <button class="w-full btn-primary btn" type="submit">Login to your account</button>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Not registered?
          <a class="text-primary-700 dark:text-primary-500 hover:underline">Create account</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { ref } from 'vue';

import { authenticatedUser, login } from '../../stores/auth';
// import { activePageURL, route } from '@/stores/routes';

const loginForm = ref({ email: '', password: '' });

const $user = useStore(authenticatedUser);
// const $activeURL = useStore(activePageURL);

const handleLogin = async () => {
  await login(loginForm.value);

  if ($user.value.isAuthenticated) {
    console.log('AUTHENTICATED', $user);
    // location.href = route($activeURL.value.searchParams.get('ref')?.replace(/^\//, ''));
  } else {
    loginForm.value = { email: '', password: '' };
  }
};

// import { useMutation } from '@vue/apollo-composable';
// import { ref } from 'vue';

// import { LOGIN_USER } from '@/graphql/mutations/userMutations';

// const email = ref('');
// const password = ref('');
// const error = ref();

// const { mutate: loginGQL } = useMutation(LOGIN_USER, () => ({
//   variables: {
//     email: email.value,
//     password: password.value,
//   },
// }));

// const login = async (e) => {
//   e.preventDefault();
//   // e.stopPropagation();
//   const result = await loginGQL();
//   console.log('RESULT', result);
//   const data = result?.data.login;

//   if (data.status === '200') {
//     console.log('SUCCESS: ', data.message);
//     // window.location.href = '/';
//   } else {
//     switch (data.message) {
//       case 'auth/invalid-email':
//         error.value = 'Invalid email';
//         break;
//       case 'auth/user-not-found':
//         error.value = 'No account with that email was found';
//         break;
//       case 'auth/wrong-password':
//         error.value = 'Incorrect password';
//         break;
//       default:
//         error.value = 'Invalid email or password';
//         break;
//     }
//   }
// };
</script>
