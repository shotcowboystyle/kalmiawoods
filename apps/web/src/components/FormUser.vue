<script setup lang="ts">
import Input from '@/components/Input/Input.vue';
import { addUser, removeUser, user } from '@/stores/user';
import { useStore } from '@nanostores/vue';

export interface Props {
  isEditingUser?: boolean;
  handleCloseModal: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  isEditingUser: false,
  handleCloseModal: () => {},
});

const $user = useStore(user);

const formValues = ref({
  userId: props.isEditingUser ? $user.value.id : null,
  email: props.isEditingUser ? $user.value.email : null,
  firstName: props.isEditingUser ? $user.value.firstName : null,
  lastName: props.isEditingUser ? $user.value.lastName : null,
  mobilePhone: props.isEditingUser ? $user.value.mobilePhone : null,
  address: props.isEditingUser ? $user.value.address : null,
});

async function submit(e: Event) {
  e.preventDefault();

  const response = await fetch('/api/users', {
    method: props.isEditingUser ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues.value),
  });

  if (response.status === 200) {
    const data = await response.json();
    addUser(data);
    props.handleCloseModal();
  }
}

async function deleteUser(userId) {
  const response = await fetch('/api/users', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (response.status === 200) {
    removeUser(userId);
    props.handleCloseModal();
  }
}
</script>

<template>
  <form @submit="submit">
    <div class="w-full">
      <div class="form-control w-1/2">
        <Input
          v-model="formValues.firstName"
          placeholder="enter your first name"
          label="First name"
          label-for="firstName"
          name="firstName"
          id="firstName"
          labelClasses="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          inputClasses="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
          required />
      </div>
      <div class="form-control w-1/2">
        <Input
          v-model="formValues.lastName"
          placeholder="enter your last name"
          label="Last name"
          label-for="lastName"
          name="lastName"
          id="lastName"
          labelClasses="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          inputClasses="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
          required />
      </div>
      <div class="form-control w-full">
        <Input
          v-model="formValues.email"
          placeholder="enter your email"
          label="Email"
          type="email"
          label-for="email"
          name="email"
          id="email"
          labelClasses="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          inputClasses="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
          required />
      </div>
      <div class="form-control w-full">
        <Input
          v-model="formValues.mobilePhone"
          placeholder="enter your mobile phone number"
          label="Mobile Phone"
          label-for="mobilePhone"
          name="mobilePhone"
          id="mobilePhone"
          labelClasses="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          inputClasses="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm" />
      </div>
      <div class="form-control w-full">
        <Input
          v-model="formValues.address"
          placeholder="enter your address"
          label="Address"
          label-for="address"
          name="address"
          id="address"
          labelClasses="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          inputClasses="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm" />
      </div>
    </div>

    <div class="items-center rounded-b border-t border-gray-200 p-6 dark:border-gray-700">
      <div class="mt-8 text-right">
        <button
          type="button"
          class="mr-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
          @click="props.handleCloseModal()">
          Cancel
        </button>
        <button
          v-if="$user.id"
          type="button"
          class="btn-error mr-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
          @click="deleteUser($user.id)">
          Delete
        </button>
        <button
          type="submit"
          class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-semibold text-white shadow-sm hover:bg-gray-700">
          {{ isEditingUser ? 'Update' : 'Create' }} User
        </button>
      </div>
    </div>
  </form>
</template>
