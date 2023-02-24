<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';
import { computed, ref } from 'vue';
import { useTheme } from '../../composables/useTheme';
import { reservations } from '../../stores/reservation';

const { isDark } = useTheme();
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

const calendar = ref(null);
const $fetchedReservations = useStore(reservations);

const today = computed(() => {
  if ($fetchedReservations.value.data?.length > 0) {
    return [
      {
        key: 'today',
        highlight: {
          fillMode: 'solid',
          style: {
            backgroundColor: 'green',
          },
        },
        dates: new Date(),
      },
    ];
  } else {
    return [];
  }
});

const disabledDates = computed(() => [
  ...$fetchedReservations.value.data?.map((r) => {
    return r.dates;
  }),
]);

const attrs = computed(() => [
  ...$fetchedReservations.value.data?.map((r) => {
    return {
      key: r.id,
      dates: r.dates,
    };
  }),
  ...today.value,
]);

const masks = ref({
  weekdays: 'WWW',
});

const showModal = ref(false);
const selectedReservationId = ref(null);

const handleEditReservation = (day, reservationId = null) => {
  console.log('DAY', day);
  if (reservationId) {
    selectedReservationId.value = reservationId;
    // const reservationDetails = reservations.find((r) => r.key === reservationId)?.reservationDetails;
    // selectedReservationDetails.value = Object.assign({}, reservationDetails);
  }
  // else {
  //   selectedReservationDetails.value = Object.assign({}, { name: null, range: { start: day.date, end: day.date } });
  // }

  showModal.value = true;
};

const handleCloseModal = () => {
  showModal.value = false;
};
</script>

<template>
  <h1 v-if="$fetchedReservations?.isLoading">loading ...</h1>
  <div v-else>
    <Calendar
      ref="calendar"
      class="max-w-full overflow-hidden rounded-lg shadow-xl"
      :class="{ 'custom-calendar': smAndLarger }"
      :masks="masks"
      :attributes="attrs"
      :min-date="new Date()"
      :disabled-dates="disabledDates"
      :is-dark="isDark"
      disable-page-swipe
      is-expanded
      trim-weeks
      title-position="left"
      @dayclick="handleEditReservation"
    >
      <template #header-title="{ monthLabel, yearLabel }">
        <div class="self-center text-lg font-thin text-base-content">
          <span class="font-bold">{{ monthLabel }}</span> {{ yearLabel }}
        </div>
      </template>
    </Calendar>

    <Teleport to="body">
      <EventDetailsModal
        :show-modal="showModal"
        :reservation-id="selectedReservationId"
        :handle-close-modal="handleCloseModal"
      />
    </Teleport>
  </div>
</template>

<style lang="postcss">
.custom-calendar .vc-header {
  @apply pb-3;
}

/* .custom-calendar .vc-arrows-container {
  @apply btn-group;
} */

.custom-calendar .vc-arrows-container .vc-arrow {
  /* @apply btn btn-sm btn-outline border-neutral-content rounded-none; */
  @apply btn btn-sm btn-ghost rounded-none;
}

.custom-calendar .vc-arrows-container .vc-arrow svg {
  @apply h-5 w-5;
}

/*
.custom-calendar .vc-arrows-container .vc-arrow:first-child {
  @apply rounded-l-md border-r-0;
}

.custom-calendar .vc-arrows-container .vc-arrow:last-child {
  @apply rounded-r-md;
}
*/

.custom-calendar .vc-weeks {
  @apply p-0;
}

.custom-calendar .vc-weeks .vc-weekday {
  @apply border-y border-neutral-500 self-center p-2;
}

.custom-calendar .vc-weeks .vc-day {
  @apply min-w-[90px] relative flex flex-col w-full h-40 justify-start items-start p-0;
}

.custom-calendar .vc-weeks .vc-day .vc-day-content {
  @apply text-sm
    relative
    p-4
    leading-4
    justify-start
    items-start
    h-full
    w-full
    hover:rounded-none
    focus:rounded-none;
}

.custom-calendar .vc-weeks .vc-day .vc-day-content.is-disabled {
  @apply cursor-not-allowed hover:bg-transparent focus:bg-transparent;
}

.custom-calendar .vc-weeks .vc-day .vc-highlights .vc-day-layer {
  @apply left-2 top-2 justify-start items-start;
}

.custom-calendar .vc-weeks .vc-weekday:not(:first-child) {
  @apply border-l border-neutral-500;
}

.custom-calendar .vc-weeks .vc-day:not(.on-bottom) {
  @apply border-b border-neutral-500;
}

.custom-calendar .vc-weeks .vc-day:not(.on-right) {
  @apply border-r border-neutral-500;
}

/*
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
*/
</style>
