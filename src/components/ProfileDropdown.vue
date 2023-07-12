<script lang="ts" setup>
import { useStore } from '@nanostores/vue';

import { HOME } from '@/app/constants';
import { authUser } from '@/stores/auth';

// const { isLoading, name, email } = authUser.get()
const $authUser = useStore(authUser);

const dropdownOpen = ref(false);
const onShow = () => (dropdownOpen.value = true);
const onHide = () => (dropdownOpen.value = false);
const onToggle = () => (dropdownOpen.value = !dropdownOpen.value);
</script>

<template>
  <div v-if="!$authUser.isLoading" class="ml-3 flex items-center">
    <div>
      <button
        type="button"
        class="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button-2"
        aria-expanded="false"
        data-dropdown-toggle="dropdown-2"
        @click="onToggle">
        <span class="sr-only">Open user menu</span>
        <img
          class="h-8 w-8 rounded-full"
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="user photo" />
      </button>
    </div>

    <div class="dropdown dropdown-end bg-base-100" :class="[{ hidden: !dropdownOpen }]" id="dropdown-2">
      <div class="px-4 py-3" role="none">
        <p class="text-sm text-gray-900 dark:text-white" role="none">
          {{ $authUser.name }}
        </p>
        <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-300" role="none">
          {{ $authUser.email }}
        </p>
      </div>
      <ul class="py-1" role="none">
        <li>
          <a
            :href="HOME"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
            >Home</a
          >
        </li>
        <li>
          <a
            href="/profile"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
            >Profile</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
            >Sign out</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
