<script setup lang="ts">
import { MIN_RESERVATION_DAYS } from '@kalmiawoods/constants';
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, onClickOutside, useBreakpoints } from '@vueuse/core';
import { formatDistanceStrict } from 'date-fns';
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';
import { computed, onMounted, ref } from 'vue';
import {
  reservationDates,
  reservationFormStep,
  reservationGuests,
  updateReservationEndDate,
  updateReservationStartDate,
} from '../../stores/reservationFormWithTransition';
import { formatDateLongLocalized, formatGuests } from '../../utils/formatters';
import GuestsCounters from './GuestsCounters.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greater('sm');

const step = useStore(reservationFormStep);
const $reservationDates = useStore(reservationDates);
const $reservationGuests = useStore(reservationGuests);

const dragValue = ref({
  start: $reservationDates.value.start,
  end: $reservationDates.value.end,
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
  if ($reservationDates.value.start && $reservationDates.value.end) {
    updateReservationStartDate(day.date);
    updateReservationEndDate(null);
  } else if (!$reservationDates.value.start) {
    updateReservationStartDate(day.date);
  } else if ($reservationDates.value.start && !$reservationDates.value.end) {
    updateReservationEndDate(day.date);
  }
};

const guestsDropdown = ref();
const showGuestsDropdown = ref(false);
const toggleGuestDropdown = () => {
  showGuestsDropdown.value = !showGuestsDropdown.value;
};

onMounted(() => {
  onClickOutside(calendarPopover, () => {
    showCalendarPopover.value = false;
  });

  onClickOutside(guestsDropdown, () => {
    showGuestsDropdown.value = false;
  });
});
</script>

<template>
  <div v-if="step === 1">
    <div ref="calendarPopover" class="relative w-full h-full">
      <div class="relative">
        <div class="grid flex-grow grid-cols-[1fr,1fr] gap-x-8 items-center h-full px-0 sm:px-4 mb-4">
          <div class="z-10 w-full form-control">
            <label for="checkinDate" class="label">
              <span class="label-text">Check in</span>
            </label>
            <input
              id="checkin-date"
              type="text"
              name="checkinDate"
              placeholder="Select date"
              :value="$reservationDates.start"
              class="w-full input input-bordered"
              @focus="showCalendarPopover = true"
            />
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
              :value="$reservationDates.end"
              class="w-full input input-bordered"
              @focus="showCalendarPopover = true"
            />
          </div>
        </div>

        <div v-if="showCalendarPopover" class="-mt-2">
          <div
            class="absolute flex flex-col w-full p-4 mb-5 sm:flex-row"
            :class="{
              'border drop-shadow-2xl bg-white rounded-xl': showCalendarPopover,
            }"
          >
            <div class="w-full mb-3 sm:w-1/3">
              <span class="block mb-1 text-xl font-bold">
                {{
                  $reservationDates.start && $reservationDates.end
                    ? formatDistanceStrict(new Date($reservationDates.start), new Date($reservationDates.end)).replace(
                        'days',
                        'nights',
                      )
                    : 'Select dates'
                }}
              </span>
              <div class="text-sm text-gray-400">
                <span v-if="$reservationDates.start && $reservationDates.end">
                  {{ formatDateLongLocalized(new Date($reservationDates.start)) }} -
                  {{ $reservationDates.end && formatDateLongLocalized(new Date($reservationDates.end)) }}
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
                @drag="dragValue = $event"
                @dayclick="handleOnDayClick"
              />
            </div>
            <div class="w-full mt-2 text-right">
              <button class="btn btn-outline btn-xs" @click="showCalendarPopover = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-0 sm:px-4">
      <label for="guests" class="label">
        <span class="label-text">Guests</span>
      </label>

      <div ref="guestsDropdown" class="group form-control">
        <label
          class="flex items-center flex-grow input input-bordered"
          role="button"
          tabindex="0"
          @click="toggleGuestDropdown()"
        >
          <span class="flex-grow cursor-none">{{ formatGuests($reservationGuests) }}</span>
          <ri-arrow-down-s-fill class="w-6 h-6 cursor-none" />
        </label>

        <div class="relative mt-2">
          <div v-if="showGuestsDropdown" class="absolute">
            <div class="h-full bg-white border card-body drop-shadow-2xl card">
              <GuestsCounters />
            </div>
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
