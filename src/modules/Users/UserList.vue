<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import { HOME } from '@/app/constants';
import Modal from '@/components/Modal/Modal.vue';
import { fetchNewUsers, setActiveUserId, users } from '@/stores/user';
import { phoneFormatUSA } from '@/utils/phone';
import FormDeleteUser from './FormDeleteUser.vue';
import FormUser from './FormUser.vue';

const bodyEl = ref();
const { arrivedState } = useScroll(bodyEl);

const isAddModalOpen = ref(false);

const isDeleteModalOpen = ref(false);
const deleteUserId = ref('-1');

const $users = useStore(users);

const onCreateUser = () => {
  setActiveUserId(null);
  isAddModalOpen.value = true;
};

const onDeleteUser = (userId) => {
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
              <span class="ml-1 text-gray-400 dark:text-gray-500 md:ml-2" aria-current="page">Users</span>
            </div>
          </li>
        </ol>
      </nav>
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">All users</h1>

      <div class="sm:flex">
        <div class="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
          <form class="lg:pr-3" action="#" method="GET">
            <label for="users-search" class="sr-only">Search</label>
            <div class="relative mt-1 lg:w-64 xl:w-96">
              <input
                id="users-search"
                type="text"
                name="email"
                class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Search for users" />
            </div>
          </form>
        </div>

        <div class="ml-auto flex items-center space-x-2 sm:space-x-3">
          <button type="button" class="btn btn-primary inline-flex" @click="onCreateUser">
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
    </div>
  </div>

  <div class="flex flex-col pt-6">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-x-auto shadow">
          <table class="table table-auto">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th scope="col" class="w-4 p-4">
                  <div class="flex items-center">
                    <input
                      id="checkbox-all"
                      aria-describedby="checkbox-1"
                      type="checkbox"
                      class="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800" />
                    <label for="checkbox-all" class="sr-only">checkbox</label>
                  </div>
                </th>
                <th scope="col" class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th scope="col" class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Address
                </th>
                <th scope="col" class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Mobile Phone
                </th>
                <th scope="col" class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th scope="col" class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              <tr
                v-for="user in $users"
                :key="user?.userId"
                :data="user"
                class="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td class="w-4 p-4">
                  <div class="flex items-center">
                    <input
                      :id="`checkbox-${user?.userId}`"
                      aria-describedby="checkbox-1"
                      type="checkbox"
                      class="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800" />
                    <label :for="`checkbox-${user?.userId}`" class="sr-only"> checkbox </label>
                  </div>
                </td>

                <td class="mr-12 flex items-center space-x-6 whitespace-nowrap p-4">
                  <!-- <img
                        class="w-10 h-10 rounded-full"
                        src={asset(`/images/users/${user?.avatar}`)}
                        alt={`${user?.name} avatar`}
                      /> -->
                  <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div class="text-base font-semibold text-gray-900 dark:text-white">
                      {{ user?.firstName }} {{ user?.lastName }}
                    </div>
                    <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {{ user?.email }}
                    </div>
                  </div>
                </td>

                <td
                  class="max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                  {{ user?.address }}
                </td>

                <td class="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  <a :href="`tel:+1${user?.mobilePhone}`" class="link">
                    {{ phoneFormatUSA(user?.mobilePhone) }}
                  </a>
                </td>

                <td class="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {{ user?.role }}
                </td>

                <td class="space-x-2 whitespace-nowrap p-4 w-1/6">
                  <a :href="`/admin/users/${user?.userId}`" class="btn btn-primary">
                    <svg
                      class="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clip-rule="evenodd" />
                    </svg>
                    Edit user
                  </a>
                  <button type="button" class="btn btn-error" @click="onDeleteUser(user?.userId)">
                    <svg
                      class="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                    </svg>
                    Delete user
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <Modal v-if="isAddModalOpen" size="5xl" @close="closeAddModal">
    <template #header>
      <div class="font-bold text-lg">Add user</div>
    </template>
    <template #body>
      <FormUser class="py-4" :handle-close-modal="closeAddModal" />
    </template>
  </Modal>

  <Modal v-if="isDeleteModalOpen" size="5xl" @close="closeDeleteModal">
    <template #body>
      <FormDeleteUser :user-id="deleteUserId" :handle-close-modal="closeDeleteModal" />
    </template>
  </Modal>

  <KwToast v-model="$toastItems" class="z-50" />
</template>
