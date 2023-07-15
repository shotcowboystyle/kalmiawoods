<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import { HOME } from '@/app/constants';
import FormUserEmail from '@/modules/FormUserEmail.vue';
import FormUserPassword from '@/modules/FormUserPassword.vue';
import FormUserProfile from '@/modules/FormUserProfile.vue';
import { setViewMode, user } from '@/stores/user';

interface Props {
  mode?: string;
}

const props = withDefaults(defineProps<Props>(), { mode: 'latest' });

setViewMode(props.mode);

const $user = useStore(user);
</script>

<template>
  <div class="grid grid-cols-1 dark:bg-gray-900 xl:grid-cols-3 xl:gap-4">
    <div class="col-span-full mb-4 xl:mb-2">
      <nav class="mb-5 flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
          <li class="inline-flex items-center">
            <a
              :href="HOME"
              class="hover:text-primary-600 inline-flex items-center text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <svg class="mr-2.5 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Home
            </a>
          </li>
          <li>
            <div class="flex items-center">
              <svg
                class="h-6 w-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <a
                href="/users"
                class="hover:text-primary-600 ml-1 text-gray-700 dark:text-gray-300 dark:hover:text-white md:ml-2"
                >Users</a
              >
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg
                class="h-6 w-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-gray-400 dark:text-gray-500 md:ml-2" aria-current="page">Settings</span>
            </div>
          </li>
        </ol>
      </nav>
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">User settings</h1>
    </div>

    <!-- Right Content -->
    <div class="col-span-full xl:col-auto">
      <div
        class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2">
        <div class="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
          <!-- <PictureUploader title="Profile picture" /> -->
        </div>
      </div>
    </div>

    <div class="col-span-2">
      <div
        class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2">
        <h3 class="mb-4 text-xl font-semibold dark:text-white">General information</h3>
        <span v-if="!$user.id" class="loading loading-spinner loading-lg"></span>
        <FormUserProfile v-else :user-id="mode" />
      </div>

      <div
        class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2">
        <h3 class="mb-4 text-xl font-semibold dark:text-white">Password information</h3>
        <span v-if="!$user.id" class="loading loading-spinner loading-lg"></span>
        <FormUserPassword v-else :user-id="mode" />
      </div>

      <div
        class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2">
        <h3 class="mb-4 text-xl font-semibold dark:text-white">Change email</h3>
        <span v-if="!$user.id" class="loading loading-spinner loading-lg"></span>
        <FormUserEmail v-else :user-id="mode" />
      </div>
    </div>
  </div>
</template>
