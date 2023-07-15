<script lang="ts" setup>
import { useStore } from '@nanostores/vue';

import { HOME } from '@/app/constants';
import { authUser } from '@/stores/auth';

// const { isLoading, name, email } = authUser.get()
const $authUser = useStore(authUser);

// const dropdownOpen = ref(false);
// const onShow = () => (dropdownOpen.value = true);
// const onHide = () => (dropdownOpen.value = false);
// const onToggle = () => (dropdownOpen.value = !dropdownOpen.value);

const handleLogout = async () => {
  await fetch('/logout', {
    method: 'POST',
    // headers: {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    // },
    // body: JSON.stringify(formValues),
  });
};
</script>

<template>
  <div v-if="!$authUser.isLoading" class="ml-3 flex items-center">
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <span class="sr-only">Open user menu</span>
          <img
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="user photo" />
        </div>
      </label>
      <div tabindex="0" class="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-base-100 text-base-content">
        <div class="card-body">
          <div class="px-4 py-3" role="none">
            <p class="text-sm text-gray-900 dark:text-white" role="none">
              {{ $authUser.name }}
            </p>
            <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-300" role="none">
              {{ $authUser.email }}
            </p>
          </div>
          <ul class="menu w-full">
            <li>
              <a
                :href="HOME"
                role="menuitem"
                >Home</a
              >
            </li>
            <li>
              <a
                href="/profile"
                role="menuitem"
                >Profile</a
              >
            </li>
            <li>
              <a
                href="#"
                role="menuitem"
                @click.prevent="handleLogout"
                >Logout</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
