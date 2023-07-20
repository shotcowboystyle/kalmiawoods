<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import { HOME } from '@/app/constants';
import Modal from '@/components/Modal/Modal.vue';
import KwToast from '@/components/Toast/KwToast.vue';
import { fetchNewUsers, setActiveUserId, users } from '@/stores/user';
import { phoneFormatUSA } from '@/utils/phone';
import FormDeleteUser from './FormDeleteUser.vue';
import FormUser from './FormUser.vue';

const bodyEl = ref();
const { arrivedState } = useScroll(bodyEl);

const isAddModalOpen = ref(false);

const isDeleteModalOpen = ref(false);
const deleteUserId = ref('');

const $users = useStore(users);
console.log('$USERS', $users);

const onCreateUser = () => {
  setActiveUserId(null);
  isAddModalOpen.value = true;
};

const onDeleteUser = (userId: string) => {
  deleteUserId.value = userId;
  isDeleteModalOpen.value = true;
};

const closeAddModal = () => {
  setActiveUserId(null);
  isAddModalOpen.value = false;
};

const closeDeleteModal = () => {
  setActiveUserId(null);
  isDeleteModalOpen.value = false;
};

watch(arrivedState, ({ bottom }) => {
  if (bottom) {
    fetchNewUsers();
  }
});
</script>

<template>
  <div class="mb-2">
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
            <span class="ml-1 text-gray-400 dark:text-gray-500 md:ml-2" aria-current="page">Users</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">All users</h1>
      <button type="button" class="btn btn-primary btn-sm md:btn-md" @click="onCreateUser">
        <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"></path>
        </svg>
        Add user
      </button>
    </div>
  </div>

  <div class="overflow-x-auto shadow">
    <table class="table">
      <thead class="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th scope="col" class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Name</th>
          <td class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Address</td>
          <td class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Mobile Phone</td>
          <td class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Role</td>
          <td class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Actions</td>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        <tr v-for="user in $users" :key="user?.userId" :data="user" class="hover">
          <td class="mr-4 flex items-center space-x-3 whitespace-nowrap p-4">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img src="https://placebeard.it/56/56" :alt="user?.firstName" />
              </div>
            </div>
            <div>
              <div class="font-bold">{{ user?.firstName }} {{ user?.lastName }}</div>
              <div class="text-sm opacity-50">{{ user?.email }}</div>
            </div>
          </td>

          <td
            class="mr-4 max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
            <span v-html="user?.address?.replace(/,/, '<br />')"></span>
          </td>

          <td class="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            <a :href="`tel:+1${user?.mobilePhone}`" class="link">
              {{ phoneFormatUSA(user?.mobilePhone) }}
            </a>
          </td>

          <td class="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            {{ user?.role }}
          </td>

          <td class="space-x-2 whitespace-nowrap p-4 w-36">
            <a :href="`/admin/users/${user!.userId}`" class="btn">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fill-rule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clip-rule="evenodd" />
              </svg>
              <span class="sr-only">Edit</span>
            </a>
            <button type="button" class="btn btn-error" @click="onDeleteUser(user!.userId)">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
              <span class="sr-only">Delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Modal v-if="isAddModalOpen" size="5xl" @close="closeAddModal">
    <template #header>
      <div class="font-bold text-lg">Add user</div>
    </template>
    <template #body>
      <FormUser class="py-4" :handle-close-modal="closeAddModal" />
    </template>
  </Modal>

  <Modal v-if="isDeleteModalOpen" size="lg" @close="closeDeleteModal">
    <template #body>
      <FormDeleteUser :user-id="deleteUserId" :handle-close-modal="closeDeleteModal" />
    </template>
  </Modal>

  <KwToast v-model="$toastItems" class="z-50" />
</template>
