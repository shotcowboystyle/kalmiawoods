<script setup lang="ts">
const hasErrors = ref(false);
const errorMessage = ref(null);
const showSuccessMessage = ref(false);
const isSubmitting = ref(false);
const formData = reactive({
  email: '',
});

function invalidateForm() {
  hasErrors.value = true;
}

async function submit() {
  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    const authResponse = await fetch('/api/password-reset', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (authResponse.status !== 200) {
      const data = await authResponse.json();
      errorMessage.value = data.message;
    }

    if (authResponse.status === 200) {
      return (showSuccessMessage.value = true);
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
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

    <div class="flex flex-wrap items-start">
      Already have an account? &nbsp;
      <a href="login" class="link text-primary">Login</a>.
    </div>

    <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="loading loading-spinner"></span>
      <span v-else>Send email</span>
    </button>
  </form>
  <p v-if="errorMessage" class="text-error">{{ errorMessage }}</p>
  <p v-if="showSuccessMessage" class="text-success">A verification email was sent to your inbox</p>
</template>
