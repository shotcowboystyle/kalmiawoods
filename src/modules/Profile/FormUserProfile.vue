<script setup lang="ts">
import { useStore, useVModel } from '@nanostores/vue';
import { useToast } from 'vue-toastification';

import { activeUserId, profileData, updateUser, user, usersMobilePhones } from '@/stores/user';
import { fetchPut } from '@/utils/fetchClient';
import { formatPhoneInputUSA } from '@/utils/phone';

const emit = defineEmits(['input-mobile-phone']);

const toast = useToast();

const $activeUserId = useStore(activeUserId);
const $user = useStore(user);
const $usersMobilePhones = useStore(usersMobilePhones);

const isSubmitting = ref(false);
const { firstNameModel, lastNameModel, mobilePhoneModel, addressModel } = useVModel(profileData, [
  'firstName',
  'lastName',
  'mobilePhone',
  'address',
]);

const maskPhone = (event: Event) => {
  const { value } = event.target as HTMLInputElement;
  mobilePhoneModel.value = formatPhoneInputUSA(value);
  emit('input-mobile-phone', mobilePhoneModel);
};

async function submit() {
  isSubmitting.value = true;

  const formData = profileData.get();
  // const changedData = diff($user.value, formData);

  try {
    const response = await fetchPut(`admin/users/${$activeUserId.value}/profile`, {
      userId: $activeUserId.value,
      profileData: formData,
    });
    const data = await response.json();
    updateUser(data);
    toast.success('Update successful.');
  } catch (error: any) {
    toast.error(JSON.parse(error).message);
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
        v-model="firstNameModel"
        required />

      <KwTextField
        type="text"
        class="form-control w-full"
        label="Last name"
        name="lastName"
        id="lastName"
        placeholder="enter user's last name"
        v-model="lastNameModel"
        required />
    </div>

    <KwTextField
      class="form-control w-full mb-4"
      label="Mobile phone"
      name="mobilePhone"
      id="mobilePhone"
      placeholder="enter user's mobile phone"
      autocomplete="off"
      v-model="mobilePhoneModel"
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
      v-model="addressModel" />

    <div class="flex gap-6 justify-end mt-8">
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
