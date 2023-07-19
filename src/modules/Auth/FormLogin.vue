<script setup lang="ts">
import { HOME } from '@/app/constants';
import { fetchPost } from '@/utils/fetchClient';

const showErrorMessage = ref(false);
const isSubmitting = ref(false);
const formData = reactive({
  email: '',
  password: '',
});

async function submit() {
  isSubmitting.value = true;

  try {
    const response = await fetchPost('auth', formData);
    if (response.status === 200) {
      location.href = HOME;
    } else {
      showErrorMessage.value = true;
    }
  } catch {
    showErrorMessage.value = true;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div v-if="showErrorMessage" class="mb-4 text-sm font-normal text-red-600">Incorrect email or password</div>
  <KwForm @submit="submit" class="mt-8 space-y-6">
    <div class="form-control w-full max-w-xs">
      <KwTextField
        class="form-control w-full max-w-xs"
        label="Email"
        name="email"
        id="email"
        v-model="formData.email"
        required
        :rules="['email']"
        type="email" />
    </div>

    <div class="form-control w-full max-w-xs">
      <KwTextField
        class="form-control w-full max-w-xs"
        label="Password"
        name="password"
        id="password"
        v-model="formData.password"
        required
        type="password" />
    </div>

    <div class="flex flex-wrap items-start">
      <a href="/auth/password-reset" class="link text-primary"> Lost Password? </a>
    </div>

    <div class="flex gap-6 justify-start mt-8">
      <KwButton variant="primary" text="Login" type="submit" :disabled="isSubmitting" :loading="isSubmitting" />
    </div>
  </KwForm>
</template>
