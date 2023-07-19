<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';

import Modal from '@/components/Modal/Modal.vue';
import KwToast from '@/components/Toast/KwToast.vue';
import { theme } from '@/stores/app';
import { reservations, reservedDates, setActiveReservationId } from '@/stores/reservation';
import type { CalendarDay } from '@/types/FullCalendar';
import FormReservation from './FormReservation.vue';

defineProps<{
  isAdmin?: boolean;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndLarger = breakpoints.greaterOrEqual('md');

const showModal = ref(false);
const isEditingReservation = ref(false);

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

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="sm:w-[40vw] md:w-[90vw]">
    <Calendar
      ref="calendar"
      class="max-w-full overflow-hidden rounded-lg shadow-xl calendar"
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
      <template #header-title="{ monthLabel, yearLabel }">
        <div class="self-center text-lg font-thin">
          <span class="font-extrabold">{{ monthLabel }}</span>
          <span class="text-slate-900 ml-2">{{ yearLabel }}</span>
        </div>
      </template>
      <template #day-content="{ day, attributes }">
        <div
          class="z-10 flex h-full flex-col overflow-hidden cursor-pointer md:min-h-16 md:w-full"
          :class="[
            { 'is-disabled': !isAdmin && day.isDisabled },
            { 'is-reserved': day.isDisabled },
            { 'hover:bg-neutral-50 focus:bg-neutral-50': !day.isDisabled },
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
              class="p-1 text-xs rounded-sm bg-primary text-primary-content md:mb-1 md:mt-0 font-semibold md:leading-tight truncate">
              <span class="hidden md:inline">
                <span v-if="attributes?.[0]?.customData?.title?.length">{{ attributes?.[0]?.customData?.title }}</span>
                <span v-else>
                  {{ attributes?.[0]?.customData?.user?.firstName }}
                  {{ attributes?.[0]?.customData?.user?.lastName }}
                </span>
              </span>
              <span v-if="attributes?.[0]?.customData?.buildings?.length > 0" class="hidden md:inline">
                <span v-if="attributes?.[0]?.customData?.buildings?.length === 3"> - All locations </span>
                <span v-else>
                  -
                  <template v-for="(building, idx) in attributes?.[0]?.customData?.buildings" :key="building">
                    <span v-if="idx === 1"> and </span>
                    <span class="lowercase">{{ building }}</span>
                  </template>
                </span>
              </span>
            </p>
          </div>
        </div>
      </template>
    </Calendar>
  </div>

  <Modal size="3xl" v-if="showModal" @close="closeModal">
    <template #header>
      <div class="text-lg font-bold">{{ modalTitlePrefix }} reservation</div>
    </template>
    <template #body>
      <FormReservation
        class="mt-4"
        :selected-date="selectedReservationDate"
        :handle-close-modal="closeModal"
        :is-admin="isAdmin"
        :is-editing-reservation="isEditingReservation" />
    </template>
  </Modal>

  <KwToast v-model="$toastItems" class="z-50" />
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
    @apply border-t border-neutral-300 p-0;
  }

  .vc-weekday {
    @apply self-center;

    &:not(:last-child) {
      @apply border-r border-neutral-300;
    }
  }
  .vc-day {
    @apply p-0 md:w-max;

    &.on-top {
      @apply border-t border-neutral-300;
    }

    &:not(.on-bottom) {
      @apply border-b border-neutral-300;
    }

    &:not(.on-right) {
      @apply border-r border-neutral-300;
    }
  }
  .vc-day .is-reserved {
    @apply rounded-none bg-neutral-200 hover:bg-neutral-200 focus:bg-neutral-200;
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
