<script setup lang="ts">
import { addUser, user } from '@/stores/user';
import { formatPhoneInputUSA } from '@/utils/phone';
import { useStore } from '@nanostores/vue';

export interface Props {
  isEditingUser?: boolean;
  handleCloseModal: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  isEditingUser: false,
  handleCloseModal: () => {},
});

const emit = defineEmits(['input-mobile-phone']);

const $user = useStore(user);

const isSubmitting = ref(false);
const hasErrors = ref(false);
const formValues = reactive({
  id: props.isEditingUser ? $user.value.id : undefined,
  email: props.isEditingUser ? $user.value.email : '',
  firstName: props.isEditingUser ? $user.value.firstName : '',
  lastName: props.isEditingUser ? $user.value.lastName : '',
  mobilePhone: props.isEditingUser ? $user.value.mobilePhone : '',
  address: props.isEditingUser ? $user.value.address : undefined,
});

const maskPhone = (event: Event) => {
  const { value } = event.target as HTMLInputElement;
  formValues.mobilePhone = formatPhoneInputUSA(value);
  emit('input-mobile-phone', formValues.mobilePhone);
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
  isSubmitting.value = true;

  const response = await fetch('/api/users', {
    method: props.isEditingUser ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues),
  });

  if (response.status === 200) {
    const data = await response.json();
    addUser(data);
    props.handleCloseModal();
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
          v-model="formValues.firstName"
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
          v-model="formValues.lastName"
          class="input input-bordered w-full max-w-xs"
          type="text"
          name="lastName"
          id="lastName"
          placeholder="enter user's last name"
          @invalid="invalidateForm"
          required />
      </div>
    </div>

    <div class="flex gap-x-6 mb-4">
      <div class="form-control w-full max-w-xs">
        <label class="label" for="email">
          <span class="label-text">Email <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formValues.email"
          class="input input-bordered w-full max-w-xs"
          type="email"
          name="email"
          id="email"
          placeholder="enter user's email"
          autocomplete="off"
          @invalid="invalidateForm"
          required />
      </div>

      <div class="form-control w-full max-w-xs">
        <label class="label" for="mobilePhone">
          <span class="label-text">Mobile phone <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formValues.mobilePhone"
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
    </div>

    <div class="form-control w-full mb-4">
      <label class="label" for="address">
        <span class="label-text">Address <span class="text-muted">(optional)</span></span>
      </label>
      <input
        v-model="formValues.address"
        class="input input-bordered w-full max-w-xs"
        type="text"
        name="address"
        id="address"
        placeholder="enter user's address"
        autocomplete="off" />
    </div>

    <div class="flex gap-6 justify-end mt-8">
      <button type="button" class="btn btn-link" @click="props.handleCloseModal()">Cancel</button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="loading loading-spinner"></span>
        <span v-else>{{ isEditingUser ? 'Update' : 'Create' }} User</span>
      </button>
    </div>
  </form>
</template>
