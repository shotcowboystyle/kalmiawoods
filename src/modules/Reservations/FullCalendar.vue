<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';

import { HOME } from '@/app/constants';
import Modal from '@/components/Modal/Modal.vue';
import { theme } from '@/stores/app';
import { authUser } from '@/stores/auth';
import { reservations, reservedDates, setActiveReservationId } from '@/stores/reservation';
import type { CalendarDay } from '@/types/FullCalendar';
import { capitalize } from '@/utils/string';
import FormReservation from './FormReservation.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndLarger = breakpoints.greaterOrEqual('md');

const showModal = ref(false);
const isEditingReservation = ref(false);

const $authUser = useStore(authUser);

const colorMode = useStore(theme);

const calendar = ref(null);
const $fetchedReservations = useStore(reservations);

const disabledDates = useStore(reservedDates);

const attrs = computed(() => [
  ...Object.entries($fetchedReservations.value)?.map(([key, val]) => {
    return {
      key,
      popover: {
        label: `${val?.user.firstName} ${val?.user.lastName}`,
      },
      customData: val,
      dates: {
        start: val && new Date(val.checkInDate),
        end: val && new Date(val.checkOutDate),
      },
    };
  }),
]);

const masks = ref({
  weekdays: 'WWW',
});

const modalTitlePrefix = ref<string>('Add');
const selectedReservationDate = ref<string | undefined>();
const onDayClick = (day: CalendarDay, reservationId = null) => {
  if (reservationId) {
    setActiveReservationId(reservationId);
    modalTitlePrefix.value = 'Edit';
    isEditingReservation.value = true;
  } else {
    setActiveReservationId(null);
    modalTitlePrefix.value = 'Add';
    selectedReservationDate.value = day.date.toDateString();
    isEditingReservation.value = false;
  }

  showModal.value = true;
};

const addNewReservation = () => {
  setActiveReservationId(null);
  modalTitlePrefix.value = 'Add';
  selectedReservationDate.value = new Date().toDateString();
  isEditingReservation.value = false;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
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
            <span class="ml-1 text-gray-400 dark:text-gray-500 md:ml-2" aria-current="page">Reservations</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Reservations</h1>
      <button type="button" class="btn btn-primary btn-sm md:btn-md" @click="addNewReservation">
        <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"></path>
        </svg>
        New reservation
      </button>
    </div>
  </div>

  <Calendar
    ref="calendar"
    class="shadow-xl calendar"
    :class="{ 'custom-calendar': mdAndLarger }"
    :masks="masks"
    :attributes="attrs"
    :min-date="new Date()"
    :disabled-dates="disabledDates"
    disable-page-swipe
    is-expanded
    trim-weeks
    :is-dark="colorMode === 'dark'"
    title-position="left">
    <template #title="{ monthLabel, yearLabel }">
      <div class="vc-header is-lg self-center text-lg text-base-content" style="grid-template-columns: [title] auto 1fr [prev] auto [next] auto;">
        <button type="button" class="vc-title">
          <span class="font-extrabold">{{ monthLabel }}</span>
          <span class="font-thin text-slate-900 ml-2">{{ yearLabel }}</span>
        </button>
      </div>
    </template>
    <template #day-content="{ day, attributes }">
      <div
        class="z-10 flex h-full flex-col overflow-hidden cursor-pointer md:min-h-16 md:w-full"
        :class="[
          { 'is-disabled': !$authUser.isAdmin && day.isDisabled },
          { 'is-reserved': day.isDisabled },
          // { 'hover:bg-neutral-50 focus:bg-neutral-50 hover:dark:bg-blate-800 focus:dark:bg-blate-800': !day.isDisabled },
        ]"
        :aria-disabled="day.isDisabled"
        @click="onDayClick(day, attributes?.[0]?.key)">
        <span class="self-center py-4 text-sm day-label text-gray-90 0 md:p-4 md:leading-4">
          {{ day.day }}
        </span>
        <div class="flex-grow overflow-x-auto overflow-y-auto">
          <p
            v-if="attributes?.[0]"
            :key="attributes?.[0]?.key"
            class="p-2 text-sm rounded-sm bg-primary text-primary-content md:mb-1 md:mt-0">
            <div class="hidden md:inline">
              <p class="font-bold truncate">
                <span v-if="attributes?.[0]?.customData?.title?.length">{{ attributes?.[0]?.customData?.title }}</span>
                <span v-else>
                  {{ attributes?.[0]?.customData?.user?.firstName }}
                  {{ attributes?.[0]?.customData?.user?.lastName }}
                </span>
              </p>
              <p v-if="attributes?.[0]?.customData?.buildings?.length > 0">
                <span v-if="attributes?.[0]?.customData?.buildings?.length === 3">All locations </span>
                <span v-else>
                  <template v-for="(building, idx) in attributes?.[0]?.customData?.buildings" :key="building">
                    <span v-if="idx === 1"> and </span>
                    <span>{{ capitalize(building) }}</span>
                  </template>
                </span>
              </p>
            </div>
          </p>
        </div>
      </div>
    </template>
  </Calendar>

  <Modal size="3xl" v-if="showModal" @close="closeModal">
    <template #header>
      <div class="text-lg font-bold">{{ modalTitlePrefix }} reservation</div>
    </template>
    <template #body>
      <FormReservation
        class="mt-4"
        :selected-date="selectedReservationDate"
        :handle-close-modal="closeModal"
        :is-admin="$authUser.isAdmin"
        :is-editing-reservation="isEditingReservation" />
    </template>
  </Modal>
</template>

<style lang="postcss">
.calendar.vc-container {
  border-radius: 0;

  .vc-header {
    @apply pb-3;
  }

  .vc-header .vc-arrows-container {
    @apply btn-group;

    & .vc-arrow {
      @apply btn btn-sm btn-ghost rounded-none;

      & svg {
        @apply h-5 w-5;
      }
    }
  }

  .vc-weeks {
    @apply border-t border-neutral-200 dark:border-neutral-700 p-0;
  }

  .vc-weekday {
    @apply self-center;

    &:not(:last-child) {
      @apply border-r border-neutral-200 dark:border-neutral-700;
    }
  }
  .vc-day {
    @apply p-0 md:w-max;

    &.on-top {
      @apply border-t border-neutral-200 dark:border-neutral-700;
    }

    &:not(.on-bottom) {
      @apply border-b border-neutral-200 dark:border-neutral-700;
    }

    &:not(.on-right) {
      @apply border-r border-neutral-200 dark:border-neutral-700;
    }
  }
  .vc-day .is-reserved {
    @apply rounded-none bg-neutral-200 dark:bg-slate-800 hover:bg-neutral-200 focus:bg-neutral-200 hover:dark:bg-slate-800 focus:dark:bg-slate-800;

    .day-label {
      @apply dark:text-slate-500;
    }
  }
  .vc-day .is-disabled {
    @apply cursor-not-allowed;
  }
}

.custom-calendar.vc-container {
  width: max-content;

  & .vc-popover-content {
    max-height: 300px;
    overflow: hidden;
    overflow-y: auto;
  }

  & .vc-day-popover-row-content {
    max-width: 250px;
    flex-direction: column;
    padding: 8px;
    border: 1px solid #3082ce;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  & .vc-weekday {
    @apply p-2;
  }

  & .vc-day {
    @apply relative flex w-full md:min-w-[90px] flex-col items-start justify-start md:h-40;

    & .vc-day-content {
      @apply relative
        h-full
        w-full
        items-start
        justify-start
        border-0
        p-4
        text-sm
        leading-4
        hover:rounded-none
        focus:rounded-none;
    }

    & .vc-highlights .vc-day-layer {
      @apply top-2 items-start justify-start;
    }

    & .vc-highlights .vc-day-layer .vc-highlight:not(.vc-highlight-base-start) {
      @apply ml-3;
    }

    & .vc-highlights .vc-day-layer .vc-highlight.vc-highlight-base-start {
      @apply ml-5;
      width: 100% !important;
    }
  }

  & .vc-day-dots {
    margin-bottom: 5px;
  }
}
</style>
