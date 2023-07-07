<script setup lang="ts">
import {
  reservationDates,
  reservations,
  // reservationGuests,
  // setReservationFormActiveStep,
  updateReservationEndDate,
  updateReservationStartDate,
} from '@/stores/reservation';
import { fetchNewUsers, users } from '@/stores/user';
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, onClickOutside, useBreakpoints } from '@vueuse/core';
// import 'v-calendar/dist/style.css';
// import Dropdown from '@/components/Dropdown/Dropdown.vue';
import Select from '@/components/Select/Select.vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';
// import GuestsCounters from './GuestsCounters.vue';
// import StepCompletedIcon from './StepCompletedIcon.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greater('sm');

// const activeStep = useStore(activeReservationFormStep);
const $reservationDates = useStore(reservationDates);
const $users = useStore(users);

const selectUserOptions = computed(() => [
  ...$users.value?.map((u) => {
    return {
      value: u.id,
      name: `${u.firstName} ${u.lastName}`,
    };
  }),
]);
const formValues = ref({
  user: '',
  start: $reservationDates.value.checkInDate,
  end: $reservationDates.value.checkOutDate,
});
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
const bodyEl = ref();
const usersList = ref();
const { arrivedState } = useScroll(usersList);

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
  onClickOutside(bodyEl, () => {
    showCalendarPopover.value = false;
  });
});

watch(arrivedState, ({ bottom }) => {
  if (bottom) {
    fetchNewUsers();
  }
});
</script>

<template>
  <div ref="bodyEl" class="relative w-full">
    <Select v-model="formValues.user" :options="selectUserOptions" />
    <!-- <Dropdown placement="bottom" text="Select guest">
      <div class="">
        <ul
          class="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownUsersButton"
          ref="usersList">
          <li v-for="(user, idx) in $users" :key="user.id" :data="user">
            <p class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              {{ user.firstName }} {{ user.lastName }}
            </p>
          </li>
        </ul>
        <a
          href="#"
          class="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 hover:bg-gray-100 hover:underline dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-gray-600">
          <svg
            class="w-5 h-5 mr-1"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
          </svg>
          Add new user
        </a>
      </div>
    </Dropdown> -->

    <DatePicker
      v-model="formValues"
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
      @drag="dragValue = $event">
      <template #default="{ inputValue, inputEvents }">
        <div class="flex items-center justify-center">
          <div class="mb-4 grid h-full flex-grow grid-cols-[1fr,1fr] items-center gap-x-8 px-0 sm:px-4">
            <div class="form-control w-full">
              <label for="checkInDate" class="label">
                <span class="label-text">Check in</span>
              </label>
              <input
                id="checkInDate"
                type="text"
                name="checkInDate"
                placeholder="Select date"
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="input input-bordered w-full" />
              <!-- @focus="showCalendarPopover = true" -->
            </div>

            <div class="form-control w-full">
              <label for="checkOutDate" class="label">
                <span class="label-text">Check out</span>
              </label>
              <input
                id="checkOutDate"
                type="text"
                name="checkOutDate"
                placeholder="Select date"
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="input input-bordered w-full" />
              <!-- @focus="showCalendarPopover = true" -->
            </div>
          </div>
        </div>
      </template>
    </DatePicker>

    <!-- <div class="relative">
      <div class="mb-4 grid h-full flex-grow grid-cols-[1fr,1fr] items-center gap-x-8 px-0 sm:px-4">
        <div class="w-full form-control">
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

        <div class="w-full form-control">
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
          <div class="w-full mb-3">
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
          <div class="w-full">
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
    </div> -->
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
