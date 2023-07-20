<script setup lang="ts">
import { addUser, usersEmails, usersMobilePhones } from '@/stores/user';
import type { CreateUserInput } from '@/types/User';
import { fetchPost } from '@/utils/fetchClient';
import { formatPhoneInputUSA } from '@/utils/phone';
import { useStore } from '@nanostores/vue';

const toast: { error: Function } | undefined = inject('toast');

export interface Props {
  handleCloseModal: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  handleCloseModal: () => {},
});

const emit = defineEmits(['input-mobile-phone']);

const $usersEmails = useStore(usersEmails);
const $usersMobilePhones = useStore(usersMobilePhones);

const isSubmitting = ref(false);
const formData = reactive<CreateUserInput>({
  email: '',
  firstName: '',
  lastName: '',
  mobilePhone: '',
  address: '',
});

const maskPhone = (event: Event) => {
  const { value } = event.target as HTMLInputElement;
  formData.mobilePhone = formatPhoneInputUSA(value);
  emit('input-mobile-phone', formData.mobilePhone);
};

async function submit() {
  isSubmitting.value = true;

  try {
    const response = await fetchPost('users', formData);
    const data = await response.json();
    addUser(data);
    props.handleCloseModal();
  } catch (error: any) {
    toast?.error(error.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <KwForm @submit="submit">
    <div class="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-6 mb-4">
      <KwTextField
        type="text"
        class="form-control w-full"
        label="First name"
        name="firstName"
        id="firstName"
        placeholder="enter user's first name"
        v-model="formData.firstName"
        required />

      <KwTextField
        type="text"
        class="form-control w-full"
        label="Last name"
        name="lastName"
        id="lastName"
        placeholder="enter user's last name"
        v-model="formData.lastName"
        required />
    </div>

    <KwTextField
      class="form-control w-full mb-4"
      label="Email"
      name="email"
      id="email"
      v-model="formData.email"
      required
      :rules="['email', 'isUnique']"
      :validation-matchers="$usersEmails"
      errorMessagePrefix="Email"
      type="email"
      placeholder="enter user's email"
      autocomplete="off" />

    <KwTextField
      class="form-control w-full mb-4"
      label="Mobile phone"
      name="mobilePhone"
      id="mobilePhone"
      placeholder="enter user's mobile phone"
      autocomplete="off"
      v-model="formData.mobilePhone"
      required
      :rules="['phone', 'isUnique']"
      :validation-matchers="$usersMobilePhones"
      type="tel"
      @input="maskPhone" />

    <KwTextField
      type="text"
      class="form-control w-full mb-4"
      label="Address"
      name="address"
      id="address"
      placeholder="enter user's address"
      v-model="formData.address" />

    <div class="flex gap-6 justify-end mt-8">
      <button type="button" class="btn btn-ghost" @click="handleCloseModal">Cancel</button>
      <KwButton
        variant="primary"
        text="Create User"
        icon-right="arrow-right"
        type="submit"
        :disabled="isSubmitting"
        :loading="isSubmitting" />
    </div>
  </KwForm>
</template>
