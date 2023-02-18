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
} from '../../stores/reservationForm';
import { formatDateLongLocalized, formatGuests } from '../../utils/formatters';
import GuestsCounters from './GuestsCounters.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

const step = useStore(reservationFormStep);
const $reservationDates = useStore(reservationDates);
const $reservationGuests = useStore(reservationGuests);

const dragValue = ref({
  start: null,
  end: null,
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

const showGuestsDropdown = ref(false);
const guestsDropdown = ref();

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
    <div class="relative w-full h-full" ref="calendarPopover">
      <div class="relative">
        <div class="grid flex-grow grid-cols-[1fr,1fr] gap-x-8 items-center h-full px-4 mb-8">
          <div class="z-10 w-full form-control">
            <label for="checkinDate" class="label">
              <span class="label-text">Check in</span>
            </label>
            <input
              type="text"
              name="checkinDate"
              id="checkin-date"
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
              type="text"
              name="checkoutDate"
              id="checkout-date"
              placeholder="Select date"
              :value="$reservationDates.end"
              class="w-full input input-bordered"
              @focus="showCalendarPopover = true"
            />
          </div>
        </div>

        <div v-if="showCalendarPopover" class="z-0 mt-6">
          <div
            class="absolute flex w-full px-4 pt-32 mb-5 -mt-32"
            :class="{
              'border drop-shadow-2xl bg-white rounded-xl': showCalendarPopover,
            }"
          >
            <div class="w-1/3">
              <span class="block mb-1 text-xl font-bold">
                {{
                  $reservationDates.start && $reservationDates.end
                    ? formatDistanceStrict($reservationDates.start, $reservationDates.end).replace('days', 'nights')
                    : 'Select dates'
                }}
              </span>
              <div class="text-sm text-gray-400">
                <span v-if="$reservationDates.start && $reservationDates.end">
                  {{ formatDateLongLocalized($reservationDates.start) }} -
                  {{ $reservationDates.end && formatDateLongLocalized($reservationDates.end) }}
                </span>
                <span v-else>Minimum stay: {{ MIN_RESERVATION_DAYS }} nights</span>
              </div>
            </div>
            <div class="w-2/3">
              <DatePicker
                v-model="$reservationDates"
                class="max-w-full border-0"
                color="green"
                :columns="smAndLarger ? 2 : 1"
                :rows="smAndLarger ? 1 : 2"
                :select-attribute="selectDragAttribute"
                :drag-attribute="selectDragAttribute"
                is-range
                is-expanded
                @drag="dragValue = $event"
                @dayclick="handleOnDayClick"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4">
      <label for="guests" class="label">
        <span class="label-text">Guests</span>
      </label>

      <div class="group form-control">
        <label
          class="flex items-center flex-grow input input-bordered"
          role="button"
          tabindex="0"
          @click="showGuestsDropdown = true"
        >
          <span class="flex-grow">{{ formatGuests($reservationGuests) }}</span>
          <ri-arrow-down-s-fill class="w-6 h-6" />
        </label>

        <div class="relative" ref="guestsDropdown">
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
