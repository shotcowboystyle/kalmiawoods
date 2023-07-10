<script setup lang="ts">
import { HOME } from '@/app/constants';

const hasErrors = ref(false);
const isSubmitting = ref(false);
const formData = reactive({
  email: '',
  password: '',
});

function invalidateForm() {
  hasErrors.value = true;
}

async function submit() {
  isSubmitting.value = true;

  const authResponse = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (authResponse.status === 200) {
    location.href = HOME;
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="mt-8 space-y-6" :class="[{ errors: hasErrors }]">
    <div class="form-control w-full max-w-xs">
      <label class="label" for="email">
        <span class="label-text">Email</span>
      </label>
      <input
        v-model="formData.email"
        class="input input-bordered w-full max-w-xs"
        type="email"
        name="email"
        id="email"
        placeholder="name@company.com"
        required />
    </div>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="password">
        <span class="label-text">Password</span>
      </label>
      <input
        v-model="formData.password"
        class="input input-bordered w-full max-w-xs"
        type="password"
        name="password"
        id="password"
        placeholder="name@company.com"
        required />
    </div>

    <div class="flex flex-wrap items-start">
      <a href="/password-reset" class="link text-primary"> Lost Password? </a>
    </div>

    <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="loading loading-spinner"></span>
      <span v-else>Login</span>
    </button>
  </form>
</template>
