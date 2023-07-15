<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';
// import { useTheme } from '@kalmiawoods/ui';
import Modal from '@/components/Modal/Modal.vue';
import { reservations, setActiveReservationId } from '@/stores/reservation';
import type { CalendarDay } from '@/types/FullCalendar';
import FormReservation from './FormReservation.vue';

defineProps<{
  isAdmin?: boolean;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

const isModalOpen = ref(false);
const isEditingReservation = ref(false);
// const isDark = ref();
// document.addEventListener('dark-mode', () => {
//   chart.updateOptions(getTrafficChannelsChartOptions());
// });

const calendar = ref(null);
const $fetchedReservations = useStore(reservations);

const disabledDates = computed(() => [
  ...Object.entries($fetchedReservations.value)?.map(([, val]) => {
    return {
      start: val.checkInDate,
      end: val.checkOutDate,
    };
  }),
]);

const attrs = computed(() => [
  ...Object.entries($fetchedReservations.value)?.map(([key, val]) => {
    return {
      key,
      popover: {
        label: `${val.user.firstName} ${val.user.lastName}`,
      },
      customData: val,
      dates: {
        start: new Date(val.checkInDate),
        end: new Date(val.checkOutDate),
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

  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="sm:w-[40vw] md:w-[90vw]">
    <Calendar
      ref="calendar"
      class="calendar max-w-full overflow-hidden rounded-lg shadow-xl"
      :class="{ 'custom-calendar': smAndLarger }"
      :masks="masks"
      :attributes="attrs"
      :min-date="new Date()"
      :disabled-dates="disabledDates"
      disable-page-swipe
      is-expanded
      trim-weeks
      title-position="left">
      <!-- :is-dark="isDark" -->
      <template #header-title="{ monthLabel, yearLabel }">
        <div class="self-center text-lg font-thin">
          <span class="font-extrabold">{{ monthLabel }}</span>
          <span class="text-slate-900">{{ yearLabel }}</span>
        </div>
      </template>
      <template #day-content="{ day, attributes }">
        <div
          class="min-h-16 z-10 flex h-full w-full cursor-pointer flex-col overflow-hidden"
          :class="[
            { 'is-disabled': !isAdmin && day.isDisabled },
            { 'is-reserved': day.isDisabled },
            { 'hover:bg-neutral-100 focus:bg-neutral-100': !day.isDisabled },
          ]"
          :aria-disabled="day.isDisabled"
          @click="onDayClick(day, attributes?.[0]?.key)">
          <span class="day-label text-gray-90 0 self-center py-4 text-sm md:p-4 md:leading-4">
            {{ day.day }}
          </span>
          <div class="flex-grow overflow-x-auto overflow-y-auto">
            <p
              v-if="attributes?.[0]"
              :key="attributes?.[0]?.key"
              class="bg-primary text-primary-content rounded-sm p-1 text-xs md:mb-1 md:mt-0 md:leading-tight">
              {{ attributes?.[0]?.customData?.user?.firstName }}
              {{ attributes?.[0]?.customData?.user?.lastName }}
            </p>
          </div>
        </div>
      </template>
    </Calendar>
  </div>

  <Modal size="5xl" v-if="isModalOpen" @close="closeModal">
    <template #header>
      <div class="font-bold text-lg">{{ modalTitlePrefix }} reservation</div>
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
</template>

<!-- <style lang="postcss">
@media (max-width: 768px) {
  .custom-calendar .vc-weekday {
    display: none;
  }

  .custom-calendar .vc-day {
    grid-column: 1 / 2;
    width: 100%;
    height: auto !important;
    min-height: 180px;
    padding: 10px;
    margin-bottom: -1px;
  }

  .custom-calendar,
  .custom-calendar .vc-weeks,
  .custom-calendar .vc-day {
    grid-template-columns: 1fr;
  }

  .custom-calendar .vc-day-content {
    align-self: flex-start;
  }
}
</style> -->

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
    @apply border-t border-neutral-200 p-0;
  }

  .vc-weekday {
    @apply self-center;

    &:not(:last-child) {
      @apply border-r border-neutral-200;
    }
  }
  .vc-day {
    @apply p-0;

    &.on-top {
      @apply border-t border-neutral-200;
    }

    &:not(.on-bottom) {
      @apply border-b border-neutral-200;
    }

    &:not(.on-right) {
      @apply border-r border-neutral-200;
    }
  }
  .vc-day .is-reserved {
    @apply rounded-none bg-neutral-300 hover:bg-neutral-300 focus:bg-neutral-300;
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
    @apply relative flex h-40 w-full min-w-[90px] flex-col items-start justify-start;

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
