<script setup lang="ts">
import { updateUser, user } from '@/stores/user';
import { formatPhoneInputUSA } from '@/utils/phone';
import { useStore } from '@nanostores/vue';
import { useTimeout } from '@vueuse/core';

const props = defineProps({
  userId: {
    type: String,
    default: 'latest',
  },
});

const emit = defineEmits(['input-mobile-phone']);

const showToast = ref(false);
const { ready, start } = useTimeout(3500, { controls: true, callback: () => (showToast.value = false) });

const $user = useStore(user);

const isSubmitting = ref(false);
const isSubmitSuccess = ref(false);
const isSubmitFailure = ref(false);
const hasErrors = ref(false);
const formData = reactive({
  firstName: $user.value.firstName ?? '',
  lastName: $user.value.lastName ?? '',
  mobilePhone: $user.value.mobilePhone ?? '',
  address: $user.value.address ?? '',
});

const maskPhone = (event: Event) => {
  const { value } = event.target as HTMLInputElement;
  formData.mobilePhone = formatPhoneInputUSA(value);
  emit('input-mobile-phone', formData.mobilePhone);
};

// const vPhoneMask = {
//   mounted: (el: HTMLInputElement) => {
//     el.addEventListener(
//       'keyup',
//       () => formatPhoneInputUSA(el.value),
//       { passive: true },
//     );
//   },
// };
function invalidateForm() {
  hasErrors.value = true;
}

async function submit() {
  isSubmitSuccess.value = false;
  isSubmitFailure.value = false;
  isSubmitting.value = true;

  try {
    const response = await fetch(`/api/users/${props.userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updateUserType: 'PROFILE', ...formData }),
    });

    if (response.status === 200) {
      isSubmitSuccess.value = true;
      const data = await response.json();
      updateUser(data);
    }
  } catch {
    isSubmitFailure.value = true;
  } finally {
    isSubmitting.value = false;
    showToast.value = true;
    start();
  }
}
</script>

<template>
  <form @submit.prevent="submit" :class="[{ errors: hasErrors }]">
    <div class="flex gap-x-6 mb-4">
      <div class="form-control w-full max-w-xs">
        <label class="label" for="firstName">
          <span class="label-text">First name <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formData.firstName"
          class="input input-bordered w-full max-w-xs"
          type="text"
          name="firstName"
          id="firstName"
          placeholder="enter user's first name"
          @invalid="invalidateForm"
          required />
      </div>
      <div class="form-control w-full max-w-xs">
        <label class="label" for="lastName">
          <span class="label-text">Last name <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formData.lastName"
          class="input input-bordered w-full max-w-xs"
          type="text"
          name="lastName"
          id="lastName"
          placeholder="enter user's last name"
          @invalid="invalidateForm"
          required />
      </div>
    </div>

    <div class="form-control w-full max-w-xs mb-4">
      <label class="label" for="mobilePhone">
        <span class="label-text">Mobile phone <span class="text-error">*</span></span>
      </label>
      <input
        v-model="formData.mobilePhone"
        class="input input-bordered w-full max-w-xs"
        type="tel"
        name="mobilePhone"
        id="mobilePhone"
        placeholder="enter user's mobile phone"
        autocomplete="off"
        @invalid="invalidateForm"
        @input="maskPhone"
        required />
    </div>

    <div class="form-control w-full mb-4">
      <label class="label" for="address">
        <span class="label-text">Address <span class="text-muted">(optional)</span></span>
      </label>
      <input
        v-model="formData.address"
        class="input input-bordered w-full max-w-xs"
        type="text"
        name="address"
        id="address"
        placeholder="enter user's address"
        autocomplete="off" />
    </div>

    <div class="mt-8">
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="loading loading-spinner"></span>
        <span v-else>Save</span>
      </button>
    </div>
  </form>

  <div v-if="showToast" class="toast toast-top toast-center z-50">
    <div class="alert" :class="[{ 'alert-error': isSubmitFailure }, { 'alert-success': isSubmitSuccess }]">
      <span v-if="isSubmitFailure">There was an error updating user.</span>
      <span v-else>User successfully updated.</span>
    </div>
  </div>
</template>
