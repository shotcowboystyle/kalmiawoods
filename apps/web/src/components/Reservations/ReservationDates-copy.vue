<script setup lang="ts">
import {
  reservationDates,
  reservations,
  // reservationGuests,
  // setReservationFormActiveStep,
  updateReservationEndDate,
  updateReservationStartDate,
} from '@/stores/reservation';
import { formatDateLongLocalized } from '@/utils/formatters';
import { MIN_RESERVATION_DAYS } from '@kalmiawoods/constants';
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, onClickOutside, useBreakpoints } from '@vueuse/core';
import { formatDistanceStrict } from 'date-fns';
import { DatePicker } from 'v-calendar';
// import 'v-calendar/dist/style.css';
import { computed, onMounted, ref } from 'vue';
// import GuestsCounters from './GuestsCounters.vue';
// import StepCompletedIcon from './StepCompletedIcon.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greater('sm');

// const activeStep = useStore(activeReservationFormStep);
const $reservationDates = useStore(reservationDates);
// const $reservationGuests = useStore(reservationGuests);

const $fetchedReservations = useStore(reservations);
const disabledDates = computed(() => [
  ...$fetchedReservations.value?.map((r) => {
    return {
      start: r.checkInDate,
      end: r.checkOutDate,
    };
  }),
]);

const dragValue = ref({
  start: $reservationDates.value.checkInDate,
  end: $reservationDates.value.checkOutDate,
});

const selectDragAttribute = computed(() => {
  return {
    popover: {
      visibility: 'hover',
      isInteractive: false, // Defaults to true when using slot
    },
  };
});

const showCalendarPopover = ref(false);
const calendarPopover = ref();

const handleOnDayClick = (day) => {
  if ($reservationDates.value.checkInDate && $reservationDates.value.checkOutDate) {
    updateReservationStartDate(day.date);
    updateReservationEndDate(null);
  } else if (!$reservationDates.value.checkInDate) {
    updateReservationStartDate(day.date);
  } else if ($reservationDates.value.checkInDate && !$reservationDates.value.checkOutDate) {
    updateReservationEndDate(day.date);
  }
};

onMounted(() => {
  onClickOutside(calendarPopover, () => {
    showCalendarPopover.value = false;
  });
});
</script>

<template>
  <div ref="calendarPopover" class="relative w-full">
    <div class="relative">
      <div class="mb-4 grid h-full flex-grow grid-cols-[1fr,1fr] items-center gap-x-8 px-0 sm:px-4">
        <div class="z-10 w-full form-control">
          <label for="checkinDate" class="label">
            <span class="label-text">Check in</span>
          </label>
          <input
            id="checkin-date"
            type="text"
            name="checkinDate"
            placeholder="Select date"
            :value="$reservationDates.checkInDate"
            class="w-full input input-bordered"
            @focus="showCalendarPopover = true" />
        </div>

        <div class="z-10 w-full form-control">
          <label for="checkoutDate" class="label">
            <span class="label-text">Check out</span>
          </label>
          <input
            id="checkout-date"
            type="text"
            name="checkoutDate"
            placeholder="Select date"
            :value="$reservationDates.checkOutDate"
            class="w-full input input-bordered"
            @focus="showCalendarPopover = true" />
        </div>
      </div>

      <div v-if="showCalendarPopover" class="-mt-2">
        <div
          class="absolute flex flex-col w-full p-4 mb-5 sm:flex-row"
          :class="{
            'rounded-xl border bg-white drop-shadow-2xl': showCalendarPopover,
          }">
          <div class="w-full mb-3 sm:w-1/3">
            <span class="block mb-1 text-xl font-bold">
              {{
                $reservationDates.checkInDate && $reservationDates.checkOutDate
                  ? formatDistanceStrict(
                      new Date($reservationDates.checkInDate),
                      new Date($reservationDates.checkOutDate),
                    ).replace('days', 'nights')
                  : 'Select dates'
              }}
            </span>
            <div class="text-sm text-gray-400">
              <span v-if="$reservationDates.checkInDate && $reservationDates.checkOutDate">
                {{ formatDateLongLocalized(new Date($reservationDates.checkInDate)) }} -
                {{
                  $reservationDates.checkOutDate && formatDateLongLocalized(new Date($reservationDates.checkOutDate))
                }}
              </span>
              <span v-else>Minimum stay: {{ MIN_RESERVATION_DAYS }} nights</span>
            </div>
          </div>
          <div class="w-full sm:w-2/3">
            <DatePicker
              v-model="$reservationDates"
              class="max-w-full"
              :class="{ 'border-0': smAndLarger }"
              color="green"
              :columns="smAndLarger ? 2 : 1"
              :select-attribute="selectDragAttribute"
              :drag-attribute="selectDragAttribute"
              :min-date="new Date()"
              is-range
              :is-expanded="smAndLarger"
              :trim-weeks="!smAndLarger"
              :disabled-dates="disabledDates"
              @drag="dragValue = $event"
              @dayclick="handleOnDayClick" />
          </div>
          <div class="w-full mt-2 text-right">
            <button class="btn btn-outline btn-xs" @click="showCalendarPopover = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vc-day {
  padding: 6px;
}

.vc-day-content {
  font-size: 13px;
}

.vc-highlight {
  width: 32px;
  height: 32px;
}
</style>
