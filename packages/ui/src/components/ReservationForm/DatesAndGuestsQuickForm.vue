<script setup lang="ts">
import { MIN_RESERVATION_DAYS, RESERVATION_DATES_OPTIONS } from '@kalmiawoods/constants';
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, onClickOutside, useBreakpoints } from '@vueuse/core';
import { formatDistanceStrict } from 'date-fns';
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';
import { onMounted, ref } from 'vue';
import {
  reservationDates,
  reservationGuests,
  updateReservationEndDate,
  updateReservationGuestsAdults,
  updateReservationGuestsChildren,
  updateReservationGuestsInfants,
  updateReservationGuestsPets,
  updateReservationStartDate,
} from '../../stores/reservationForm';
import { formatDateCalendar, formatDateLongLocalized, formatGuests } from '../../utils/formatters';
import ClearButton from '../common/ClearButton.vue';
import GuestsCounters from './GuestsCounters.vue';

const activeButton = ref<string | null>(null);
const buttonActiveClass = ref('is-active shadow-2xl hover:bg-white rounded-full border');

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

const $reservationDates = useStore(reservationDates);
const $reservationGuests = useStore(reservationGuests);

const calendarMinDate = new Date();

// const dragValue = ref({
//   start: null,
//   end: null,
// });

// const selectDragAttribute = computed(() => {
//   return {
//     popover: {
//       visibility: 'hover',
//       isInteractive: false, // Defaults to true when using slot
//     },
//   };
// });

const showCalendarPopover = ref(false);
const calendarPopover = ref();

const handleOnDayClick = (day) => {
  if ($reservationDates.value.start && $reservationDates.value.end) {
    updateReservationStartDate(day.date);
    updateReservationEndDate(null);
  } else if (!$reservationDates.value.start) {
    updateReservationStartDate(day.date);
    if (activeButton.value === 'start') {
      activeButton.value = 'end';
    }
  } else if ($reservationDates.value.start && !$reservationDates.value.end) {
    updateReservationEndDate(day.date);
  }
};

const handleOnClear = (key) => {
  if (key === 'start') {
    updateReservationStartDate(null);
    updateReservationStartDate(null);
  } else if (key === 'end') {
    updateReservationStartDate(null);
  } else if (key === 'guests') {
    updateReservationGuestsAdults(1);
    updateReservationGuestsChildren(0);
    updateReservationGuestsInfants(0);
    updateReservationGuestsPets(0);
  }
};

const showGuestsDropdown = ref(false);
const guestsDropdown = ref();

const handleOnButtonClick = (key: string) => {
  activeButton.value = key;
  if (key === 'guests') {
    showGuestsDropdown.value = true;
  } else {
    showCalendarPopover.value = true;
  }
};

onMounted(() => {
  onClickOutside(calendarPopover, () => {
    if (activeButton.value !== 'guests') {
      activeButton.value = null;
      showCalendarPopover.value = false;
    }
  });

  onClickOutside(guestsDropdown, () => {
    if (activeButton.value === 'guests') {
      activeButton.value = null;
      showGuestsDropdown.value = false;
    }
  });
});
</script>

<template>
  <div
    id="booking-quick-form"
    class="md:max-w-[680px] lg:max-w-[850px] mx-auto mt-2 rounded-full bg-white border border-gray-200 duration-300 hidden md:flex relative"
  >
    <div class="grid flex-grow grid-cols-[2fr,1fr,auto]">
      <div class="grid flex-grow grid-cols-[1fr,1fr] items-center h-full">
        <template v-for="{ key, placeholder, title, clearButtonName } in RESERVATION_DATES_OPTIONS" :key="key">
          <label
            role="button"
            tabindex="0"
            class="flex items-center h-full min-h-full rounded-full hover:bg-gray-200 hover:bg-opacity-40 focus:bg-white"
            :class="[activeButton === key && buttonActiveClass]"
            @click="handleOnButtonClick(key)"
          >
            <div class="flex flex-col flex-grow pr-3 text-left pl-7 min-w-[120px]">
              <span class="block text-xs font-extrabold text-gray-900">{{ title }}</span>
              <span class="block p-0 text-sm text-gray-700 truncate">
                {{ $reservationDates[key] ? formatDateCalendar($reservationDates[key]) : placeholder }}
              </span>
            </div>

            <ClearButton
              :is-active="activeButton === key"
              :is-disabled="!$reservationDates[key]"
              :on-clear="() => handleOnClear(key)"
              :name="clearButtonName"
              show-separator
            />
          </label>
        </template>
      </div>

      <div class="grid flex-grow grid-cols-[2fr,auto] items-center h-full booking-bar-option-button dropdown">
        <label
          role="button"
          tabindex="0"
          class="flex items-center h-full min-h-full text-gray-800 rounded-full peer hover:bg-gray-200 hover:bg-opacity-40 focus:bg-white"
          :class="[activeButton === 'guests' && buttonActiveClass]"
          @click="handleOnButtonClick('guests')"
        >
          <div class="flex flex-col flex-grow pr-3 text-left pl-7 min-w-[120px]">
            <span class="text-xs font-extrabold text-gray-900">Guests</span>
            <span class="block text-sm text-gray-700 truncate">
              {{ formatGuests($reservationGuests) }}
            </span>
          </div>
        </label>

        <ClearButton
          :is-active="activeButton === 'guests'"
          :is-disabled="!formatGuests($reservationGuests).length"
          :on-clear="() => handleOnClear('guests')"
          name="Clear guests"
        />
      </div>

      <a href="/book-now" class="m-1 ml-0 btn btn-circle btn-primary" rel="prefetch">
        <ri-arrow-right-line class="w-6 h-6 text-white" />
        <span class="sr-only">Continue booking</span>
      </a>
    </div>

    <div
      ref="calendarPopover"
      class="absolute flex w-full px-4 pt-6 bg-white border top-16 drop-shadow-2xl rounded-xl"
      :class="{ hidden: !showCalendarPopover }"
    >
      <div class="w-1/5">
        <div class="mb-1 text-lg font-bold text-gray-900">
          {{
            $reservationDates.start && $reservationDates.end
              ? formatDistanceStrict(new Date($reservationDates.start), new Date($reservationDates.end)).replace(
                  'days',
                  'nights',
                )
              : 'Select dates'
          }}
        </div>
        <div class="text-xs text-gray-400">
          {{
            $reservationDates.start && $reservationDates.end
              ? `${formatDateLongLocalized(new Date($reservationDates.start))} - ${
                  $reservationDates.end && formatDateLongLocalized(new Date($reservationDates.end))
                }`
              : `Minimum stay: ${MIN_RESERVATION_DAYS} nights`
          }}
        </div>
      </div>
      <div class="w-4/5 text-black">
        <DatePicker
          v-model="$reservationDates"
          class="max-w-full border-0"
          color="green"
          :columns="smAndLarger ? 2 : 1"
          :rows="smAndLarger ? 1 : 2"
          :min-date="calendarMinDate"
          is-range
          is-expanded
          @dayclick="handleOnDayClick"
        />
        <!-- @drag="dragValue = $event" -->
        <!-- :select-attribute="selectDragAttribute"
          :drag-attribute="selectDragAttribute" -->
      </div>
    </div>

    <div ref="guestsDropdown" class="absolute right-0 top-16" :class="{ hidden: !showGuestsDropdown }">
      <div class="bg-white shadow-xl dropdown-content card card-compact w-96">
        <div class="card-body">
          <GuestsCounters />
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
