<script setup lang="ts">
import Modal from '@/components/modal/Modal.vue';
import { useStore } from '@nanostores/vue';
import FormDeleteUser from './FormDeleteUser.vue';
import FormUser from './FormUser.vue';
// import { user } from '@/stores/auth';
// import { route } from '@/stores/routes';
import { fetchNewUsers, setActiveUserId, users } from '@/stores/user';

const bodyEl = ref();
const { arrivedState } = useScroll(bodyEl);

const isDeleteModalOpen = ref(false);
const isModalOpen = ref(false);
const isEditingUser = ref(false);
const modalTitlePrefix = ref<string>('Add');

const $users = useStore(users);
// const $user = useStore(user);

// const reportCount = computed(() => $users.value.length);
// const hasScroll = computed(() => bodyEl.value.clientHeight < bodyEl.value.scrollHeight);

// const handleImgLoad = (ev: Event, idx: number) => {
//   if (reportCount.value - 1 === idx) {
//     if (!hasScroll.value) {
//       fetchNewUsers();
//     }
//   }
//   if (idx == 0) {
//     const featImg = ev.target as HTMLImageElement;
//     if (featImg.height > featImg.width) featuredImgPos.value = 'portrait';
//   }
// };

// const handleFABClick = () => {
//   location.href = `${route('users/upload')}`;
// };

const onCreateUser = () => {
  setActiveUserId(null);
  modalTitlePrefix.value = 'Add';
  isEditingUser.value = false;
  isModalOpen.value = true;
};

const onEditUser = (userId) => {
  setActiveUserId(userId);
  modalTitlePrefix.value = 'Edit';
  isEditingUser.value = true;
  isModalOpen.value = true;
};

const onDeleteUser = (userId) => {
  setActiveUserId(userId);
  isDeleteModalOpen.value = true;
};

const closeModal = () => {
  setActiveUserId(null);
  isModalOpen.value = false;
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
  <div ref="bodyEl" class="block overflow-hidden shadow">
    <!-- <div v-if="$user.isLoggedIn" class="absolute right-0 w-12 bottom-12 md:bottom-14 md:m-2 md:w-14">
      <button
        class="fixed z-20 w-10 h-10 transition duration-200 ease-in bg-blue-600 rounded-full shadow-xl mouse hover:bg-blue-700 focus:outline-none active:shadow-2xl md:h-12 md:w-12"
        @click.prevent="handleFABClick">
        <svg viewBox="0 0 20 20" enable-background="new 0 0 20 20" class="inline-block w-6 h-6">
          <path
            fill="#FFFFFF"
            d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                      C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                      C15.952,9,16,9.447,16,10z"></path>
        </svg>
      </button>
    </div> -->

    <div
      class="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex lg:mt-1.5">
      <div class="mb-1 w-full">
        <div class="mb-4">
          <nav class="mb-5 flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
              <li class="inline-flex items-center">
                <a
                  href="#"
                  class="hover:text-primary-600 inline-flex items-center text-gray-700 dark:text-gray-300 dark:hover:text-white">
                  <svg
                    class="mr-2.5 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
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
                    href="#"
                    class="hover:text-primary-600 ml-1 text-gray-700 dark:text-gray-300 dark:hover:text-white md:ml-2">
                    Users
                  </a>
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
                  <span class="ml-1 text-gray-400 dark:text-gray-500 md:ml-2" aria-current="page"> List </span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">All users</h1>
        </div>

        <div class="sm:flex">
          <div class="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
            <form class="lg:pr-3" action="#" method="GET">
              <label for="users-search" class="sr-only">Search</label>
              <div class="relative mt-1 lg:w-64 xl:w-96">
                <input
                  type="text"
                  name="email"
                  id="users-search"
                  class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                  placeholder="Search for users" />
              </div>
            </form>

            <div class="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
              <a
                href="#"
                class="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clip-rule="evenodd"></path>
                </svg>
              </a>
              <a
                href="#"
                class="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"></path>
                </svg>
              </a>
              <a
                href="#"
                class="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"></path>
                </svg>
              </a>
              <a
                href="#"
                class="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div class="ml-auto flex items-center space-x-2 sm:space-x-3">
            <!-- NOTE: Not implemented (see `./CrudProducts` for reference) -->
            <!-- <button
              type="button"
              data-refresh
              class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <svg
                class="w-5 h-5 mr-2 -ml-1"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                ></path>
              </svg>
              Refresh
            </button> -->
            <button
              type="button"
              @click="onCreateUser"
              class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex w-1/2 items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4 sm:w-auto">
              <svg
                class="-ml-1 mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"></path>
              </svg>
              Add user
            </button>
            <a
              href="#"
              class="focus:ring-primary-300 inline-flex w-1/2 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
              <svg
                class="-ml-1 mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clip-rule="evenodd"></path>
              </svg>
              Export
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-4">
      <UserCard
        v-for="(user, idx) in $users"
        :key="user.id"
        :data="user"
        :class="[
          idx === 0
            ? featuredImgPos === 'landscape'
              ? 'col-span-2 row-span-2 md:col-span-3 md:row-span-3'
              : 'col-span-2 row-span-3'
            : 'col-span-1 row-span-1',
        ]"
        class="relative flex justify-center overflow-hidden rounded-lg group"
        @load="handleImgLoad($event, idx)" />
    </div>
  </div> -->

    <div class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden shadow">
            <table class="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
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
                    Status
                  </th>
                  <th scope="col" class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr
                  v-for="(user, idx) in $users"
                  :key="user.id"
                  :data="user"
                  class="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input
                        :id="`checkbox-${user.id}`"
                        aria-describedby="checkbox-1"
                        type="checkbox"
                        class="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800" />
                      <label :for="`checkbox-${user.id}`" class="sr-only"> checkbox </label>
                    </div>
                  </td>
                  <td class="mr-12 flex items-center space-x-6 whitespace-nowrap p-4">
                    <!-- <img
                        class="w-10 h-10 rounded-full"
                        src={asset(`/images/users/${user.avatar}`)}
                        alt={`${user.name} avatar`}
                      /> -->
                    <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                      <div class="text-base font-semibold text-gray-900 dark:text-white">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {{ user.email }}
                      </div>
                    </div>
                  </td>
                  <td
                    class="max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    {{ user.address }}
                  </td>
                  <td class="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                    {{ user.mobilePhone }}
                  </td>
                  <td class="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                    {{ user.role }}
                  </td>
                  <td class="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                    <div class="flex items-center">
                      <div class="mr-2 h-2.5 w-2.5 rounded-full bg-green-400" v-if="user.status === 'REGISTERED'" />
                      <div class="mr-2 h-2.5 w-2.5 rounded-full bg-red-500" v-else />
                      {{ user.status }}
                    </div>
                  </td>
                  <td class="space-x-2 whitespace-nowrap p-4">
                    <button
                      type="button"
                      @click="onEditUser(user.id)"
                      class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4">
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
                    </button>
                    <button
                      type="button"
                      @click="onDeleteUser(user.id)"
                      class="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
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

    <Modal size="5xl" v-if="isModalOpen" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg">{{ modalTitlePrefix }} user</div>
      </template>
      <template #body>
        <FormUser :handle-close-modal="closeModal" :is-editing-user="isEditingUser" />
      </template>
    </Modal>

    <Modal size="5xl" v-if="isDeleteModalOpen" @close="closeDeleteModal">
      <template #header>
        <div class="flex items-center text-lg">Delete user</div>
      </template>
      <template #body>
        <FormDeleteUser :handle-close-modal="closeDeleteModal" />
      </template>
    </Modal>
  </div>
</template>
