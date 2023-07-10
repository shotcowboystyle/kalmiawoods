<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import { HOME } from '@/app/constants';
import { setViewMode, user } from '@/stores/user';

interface Props {
  mode?: string;
}
const props = withDefaults(defineProps<Props>(), { mode: 'latest' });

setViewMode(props.mode);

const $user = useStore(user);
</script>

<template>
  <div class="grid grid-cols-1 px-4 pt-6 dark:bg-gray-900 xl:grid-cols-3 xl:gap-4">
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
                href="#"
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
          <PictureUploader title="Profile picture" />
        </div>
      </div>
    </div>

    <div class="col-span-2">
      <div
        class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2">
        <h3 class="mb-4 text-xl font-semibold dark:text-white">General information</h3>
        <form action="#">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label for="first-name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >First Name</label
              >
              <input
                v-model="$user.firstName"
                type="text"
                name="first-name"
                id="first-name"
                class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Bonnie"
                required />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="last-name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Last Name</label
              >
              <input
                v-model="$user.lastName"
                type="text"
                name="last-name"
                id="last-name"
                class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Green"
                required />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="address" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Address</label>
              <input
                v-model="$user.address"
                type="text"
                name="address"
                id="address"
                class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="e.g. California"
                required />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                v-model="$user.email"
                type="email"
                name="email"
                id="email"
                class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="example@company.com"
                required />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="phone-number" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Phone Number</label
              >
              <input
                v-model="$user.mobilePhone"
                type="number"
                name="phone-number"
                id="phone-number"
                class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="e.g. +(12)3456 789"
                required />
            </div>
            <div class="sm:col-full col-span-6">
              <button
                class="btn-primary bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4"
                type="submit">
                Save all
              </button>
            </div>
          </div>
        </form>
      </div>

      <div
        class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2">
        <h3 class="mb-4 text-xl font-semibold dark:text-white">Password information</h3>
        <form action="#">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label for="current-password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Current password</label
              >
              <input
                type="text"
                name="current-password"
                id="current-password"
                class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="••••••••"
                required />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >New password</label
              >
              <input
                data-popover-target="popover-password"
                data-popover-placement="bottom"
                type="password"
                id="password"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="••••••••"
                required />
              <div
                data-popover
                id="popover-password"
                role="tooltip"
                class="invisible absolute z-10 inline-block w-72 rounded-lg border border-gray-200 bg-white text-sm font-light text-gray-500 opacity-0 shadow-sm transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <div class="space-y-2 p-3">
                  <h3 class="font-semibold text-gray-900 dark:text-white">Must have at least 6 characters</h3>
                  <div class="grid grid-cols-4 gap-2">
                    <div class="h-1 bg-orange-300 dark:bg-orange-400"></div>
                    <div class="h-1 bg-orange-300 dark:bg-orange-400"></div>
                    <div class="h-1 bg-gray-200 dark:bg-gray-600"></div>
                    <div class="h-1 bg-gray-200 dark:bg-gray-600"></div>
                  </div>
                  <p>It’s better to have:</p>
                  <ul>
                    <li class="mb-1 flex items-center">
                      <svg
                        class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"></path>
                      </svg>
                      Upper & lower case letters
                    </li>
                    <li class="mb-1 flex items-center">
                      <svg
                        class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"></path>
                      </svg>
                      A symbol (#$&)
                    </li>
                    <li class="flex items-center">
                      <svg
                        class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"></path>
                      </svg>
                      A longer password (min. 12 chars.)
                    </li>
                  </ul>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="confirm-password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Confirm password</label
              >
              <input
                type="text"
                name="confirm-password"
                id="confirm-password"
                class="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="••••••••"
                required />
            </div>
            <div class="sm:col-full col-span-6">
              <button
                class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4"
                type="submit">
                Save all
              </button>
            </div>
          </div>
        </form>
      </div>
      <div
        class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2">
        <div class="flow-root">
          <h3 class="text-xl font-semibold dark:text-white">Sessions</h3>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li class="py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-base font-semibold text-gray-900 dark:text-white">
                    California 123.123.123.123
                  </p>
                  <p class="truncate text-sm font-normal text-gray-500 dark:text-gray-400">Chrome on macOS</p>
                </div>
                <div class="inline-flex items-center">
                  <a
                    href="#"
                    class="focus:ring-primary-300 mb-3 mr-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >Revoke</a
                  >
                </div>
              </div>
            </li>
            <li class="pb-6 pt-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-base font-semibold text-gray-900 dark:text-white">Rome 24.456.355.98</p>
                  <p class="truncate text-sm font-normal text-gray-500 dark:text-gray-400">Safari on iPhone</p>
                </div>
                <div class="inline-flex items-center">
                  <a
                    href="#"
                    class="focus:ring-primary-300 mb-3 mr-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >Revoke</a
                  >
                </div>
              </div>
            </li>
          </ul>
          <div>
            <button
              class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4">
              See more
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 px-4 xl:grid-cols-2 xl:gap-4">
    <div
      class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 xl:mb-0">
      <div class="flow-root">
        <h3 class="text-xl font-semibold dark:text-white">Alerts & Notifications</h3>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
          You can set up Themesberg to get notifications
        </p>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Item 1 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-grow flex-col">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Company News</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Get Themesberg news, announcements, and product updates
              </div>
            </div>
            <ToggleSwitch id="company-news" />
          </div>
          <!-- Item 2 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-grow flex-col">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Account Activity</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Get important notifications about you or activity you've missed
              </div>
            </div>

            <ToggleSwitch id="account-activity" checked />
          </div>
          <!-- Item 3 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-grow flex-col">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Meetups Near You</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Get an email when a Dribbble Meetup is posted close to my location
              </div>
            </div>
            <ToggleSwitch id="meetups" />
          </div>
          <!-- Item 4 -->
          <div class="flex items-center justify-between pt-4">
            <div class="flex flex-grow flex-col">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">New Messages</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Get Themesberg news, announcements, and product updates
              </div>
            </div>
            <ToggleSwitch id="new-messages" />
          </div>
        </div>
        <div class="mt-6">
          <button
            class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4">
            Save all
          </button>
        </div>
      </div>
    </div>
    <div
      class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 xl:mb-0">
      <div class="flow-root">
        <h3 class="text-xl font-semibold dark:text-white">Email Notifications</h3>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
          You can set up Themesberg to get email notifications
        </p>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Item 1 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-grow flex-col">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Rating reminders</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Send an email reminding me to rate an item a week after purchase
              </div>
            </div>
            <ToggleSwitch id="rating-reminders" />
          </div>
          <!-- Item 2 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-grow flex-col">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Item update notifications</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Send user and product notifications for you
              </div>
            </div>
            <ToggleSwitch id="item-update" />
          </div>
          <!-- Item 3 -->
          <div class="flex items-center justify-between py-4">
            <div class="flex flex-grow flex-col">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Item comment notifications</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Send me an email when someone comments on one of my items
              </div>
            </div>
            <ToggleSwitch id="item-comment" />
          </div>
          <!-- Item 4 -->
          <div class="flex items-center justify-between pt-4">
            <div class="flex flex-grow flex-col">
              <div class="text-lg font-semibold text-gray-900 dark:text-white">Buyer review notifications</div>
              <div class="text-base font-normal text-gray-500 dark:text-gray-400">
                Send me an email when someone leaves a review with their rating
              </div>
            </div>
            <ToggleSwitch id="buyer-rev" />
          </div>
        </div>
        <div class="mt-6">
          <button
            class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4">
            Save all
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
