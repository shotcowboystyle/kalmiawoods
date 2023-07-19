<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import { activeUser, activeUserId, updateUser, usersEmails } from '@/stores/user';
import { fetchPut } from '@/utils/fetchClient';

const toast: { error: Function; success: Function } | undefined = inject('toast');

const $user = useStore(activeUser);
const $activeUserId = useStore(activeUserId);
const $usersEmails = useStore(usersEmails);

const isSubmitting = ref(false);
const emailModel = ref('');

async function submit() {
  isSubmitting.value = true;

  try {
    const response = await fetchPut(`users/${$activeUserId.value}/email`, {
      newEmail: emailModel.value,
    });

    const data = await response.json();
    updateUser(data);
    toast?.success('Update successful.');
  } catch (error: any) {
    console.log('error', error);
    toast?.error(error.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <KwForm @submit="submit">
    <p>Current email: {{ $user.email }}</p>
    <div class="form-control w-full max-w-xs mb-4">
      <KwTextField
        class="form-control w-full max-w-xs"
        label="New email"
        name="newEmail"
        id="newEmail"
        v-model="emailModel"
        required
        :rules="['email', 'isUnique']"
        :validation-matchers="$usersEmails"
        errorMessagePrefix="Email"
        type="email"
        placeholder="enter user's new email"
        autocomplete="off" />
    </div>

    <div class="flex gap-6 justify-start mt-8">
      <KwButton
        variant="primary"
        text="Save"
        icon-right="arrow-right"
        type="submit"
        :disabled="isSubmitting"
        :loading="isSubmitting" />
    </div>
  </KwForm>
</template>
