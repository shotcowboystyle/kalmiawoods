<script setup lang="ts">
import { useToast } from 'vue-toastification';

import { fetchPost } from '@/utils/fetchClient';

const toast = useToast();

const isSubmitting = ref(false);
const formData = reactive({
  email: '',
});

async function submit() {
  isSubmitting.value = true;

  try {
    const response = await fetchPost('email-verification', formData);
    const data = await response.json();
    if (response.status !== 200) {
      toast.error(data.message);
    } else {
      toast.success(data.message);
    }
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <KwForm @submit="submit" class="mt-8 space-y-6">
    <KwTextField
      class="form-control w-full"
      label="Email"
      name="email"
      id="email"
      :rules="['email']"
      v-model="formData.email"
      required
      type="email" />

    <div class="flex flex-wrap items-start">
      Already completed registration? &nbsp;
      <a href="/auth/login" class="link text-primary">Login</a>.
    </div>

    <div class="flex gap-6 justify-start mt-8">
      <KwButton
        variant="primary"
        size="block"
        text="Send Email"
        type="submit"
        :disabled="isSubmitting"
        :loading="isSubmitting" />
    </div>
  </KwForm>
</template>
