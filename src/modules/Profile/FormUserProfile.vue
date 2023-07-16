<script setup lang="ts">
import { useStore, useVModel } from '@nanostores/vue';

import { activeUser, activeUserId, profileData, updateUser, usersMobilePhones } from '@/stores/user';
import { diff } from '@/utils/diff';
import { fetchPut } from '@/utils/fetchClient';
import { formatPhoneInputUSA } from '@/utils/phone';

const emit = defineEmits(['input-mobile-phone']);

const toast: { error: Function; success: Function } | undefined = inject('toast');

const $activeUserId = useStore(activeUserId);
const $usersMobilePhones = useStore(usersMobilePhones);

const isSubmitting = ref(false);
const { firstNameModel, lastNameModel, mobilePhoneModel, addressModel } = useVModel(profileData, [
  'firstName',
  'lastName',
  'mobilePhone',
  'address',
]);
const $user = useStore(activeUser);

const maskPhone = (event: Event) => {
  const { value } = event.target as HTMLInputElement;
  mobilePhoneModel.value = formatPhoneInputUSA(value);
  emit('input-mobile-phone', mobilePhoneModel);
};

async function submit() {
  isSubmitting.value = true;

  const formData = profileData.get();
  const changedData = diff($user.value, formData);

  try {
    const response = await fetchPut(`users/${$activeUserId.value}/profile`, {
      profileId: $user.value.profileId,
      profileData: changedData,
    });
    const data = await response.json();
    updateUser(data);
    toast?.success('Update successful.');
  } catch (error) {
    console.log('error', error);
    toast?.error(error.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <KwForm @submit="submit">
    <div class="flex gap-x-6 mb-4">
      <KwTextField
        type="text"
        class="form-control w-full max-w-xs"
        label="First name"
        labelAlt="required"
        name="firstName"
        id="firstName"
        placeholder="enter user's first name"
        v-model="firstNameModel"
        required />

      <KwTextField
        type="text"
        class="form-control w-full max-w-xs"
        label="Last name"
        labelAlt="required"
        name="lastName"
        id="lastName"
        placeholder="enter user's last name"
        v-model="lastNameModel"
        required />
    </div>

    <KwTextField
      class="form-control w-full max-w-xs"
      label="Mobile phone"
      labelAlt="required"
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
      class="form-control w-full max-w-xs mb-4"
      label="Address"
      name="address"
      id="address"
      placeholder="enter user's address"
      v-model="addressModel" />

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
