<script lang="ts" setup>
import { useStore } from '@nanostores/vue';

import { HOME } from '@/app/constants';
import { authUser } from '@/stores/auth';
import { fetchPost } from '@/utils/fetchClient';

const $authUser = useStore(authUser);

const handleLogout = async () => {
  await fetchPost('/logout', {});
};
</script>

<template>
  <div v-if="!$authUser.isLoading" class="ml-3 flex items-center">
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <span class="sr-only">Open user menu</span>
          <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
        </div>
      </label>
      <div tabindex="0" class="dropdown-content z-[1] mt-3 shadow bg-base-100 text-base-content">
        <div class="px-4 pt-3" role="none">
          <span class="block text-sm text-gray-900 dark:text-white" role="none">
            {{ $authUser.name }}
          </span>
          <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-300" role="none">
            {{ $authUser.email }}
          </span>
        </div>
        <div class="divider mt-2 mb-0"></div>
        <ul class="menu w-full pt-0">
          <li>
            <a :href="HOME" role="menuitem">Home</a>
          </li>
          <li>
            <a href="/profile" role="menuitem">Profile</a>
          </li>
          <li>
            <a href="#" role="menuitem" @click.prevent="handleLogout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
