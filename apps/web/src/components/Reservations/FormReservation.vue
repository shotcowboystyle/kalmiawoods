<script setup lang="ts">
import Select from '@/components/Select/Select.vue';
import { addReservation, removeReservation, reservation, reservations } from '@/stores/reservation';
import { fetchNewUsers, users } from '@/stores/user';
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

export interface Props {
  isAdmin?: boolean;
  isEditingReservation?: boolean;
  selectedDate?: string;
  handleCloseModal: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false,
  isEditingReservation: false,
  selectedDate: null,
  handleCloseModal: () => {},
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greater('sm');

const $reservation = useStore(reservation);
const $users = useStore(users);

const selectUserOptions = computed(() => [
  ...Object.values($users.value)?.map((u) => {
    return {
      value: u.id,
      name: `${u.firstName} ${u.lastName}`,
    };
  }),
]);
const formValues = ref({
  reservationId: props.isEditingReservation ? $reservation.value.reservationId : null,
  userId: props.isEditingReservation ? $reservation.value.userId : null,
  range: {
    start: props.isEditingReservation ? $reservation.value.checkInDate : props.selectedDate,
    end: props.isEditingReservation ? $reservation.value.checkOutDate : props.selectedDate,
  },
});

const $fetchedReservations = useStore(reservations);
const disabledDates = computed(() => {
  let existingReservations = Object.values($fetchedReservations.value)?.map((r) => {
    return {
      start: r.checkInDate,
      end: r.checkOutDate,
    };
  });

  if (props.isEditingReservation) {
    existingReservations = existingReservations.filter(
      (r) => r.start !== $reservation.value.checkInDate && r.end !== $reservation.value.checkOutDate,
    );
  }

  return existingReservations;
});

const popover = ref({
  visibility: 'click',
});

// const bodyEl = ref();
const usersList = ref();
const { arrivedState } = useScroll(usersList);

async function submit(e: Event) {
  e.preventDefault();

  const response = await fetch('/api/reservations', {
    method: props.isEditingReservation ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues.value),
  });

  if (response.status === 200) {
    const data = await response.json();
    addReservation(data);
    props.handleCloseModal();
  }
}

async function deleteReservation(reservationId) {
  const response = await fetch('/api/reservations', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reservationId }),
  });

  if (response.status === 200) {
    removeReservation(reservationId);
    props.handleCloseModal();
  }
}

watch(arrivedState, ({ bottom }) => {
  if (bottom) {
    fetchNewUsers();
  }
});
</script>

<template>
  <form @submit="submit">
    <!-- <div ref="bodyEl" class="w-full"> -->
    <div class="w-full">
      <div v-if="isAdmin" class="form-control w-full">
        <label for="userId" class="label">
          <span class="label-text">Main guest</span>
        </label>
        <Select
          v-model="formValues.userId"
          :options="selectUserOptions"
          id="userId"
          name="userId"
          class="input input-bordered w-full"
          required />
      </div>

      <DatePicker
        v-model.range="formValues.range"
        class="w-full"
        :class="{ 'border-0': smAndLarger }"
        color="green"
        :columns="smAndLarger ? 2 : 1"
        :min-date="new Date()"
        is-range
        is-required
        :popover="popover"
        :is-expanded="smAndLarger"
        :trim-weeks="!smAndLarger"
        :disabled-dates="disabledDates">
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
              </div>
            </div>
          </div>
        </template>
      </DatePicker>
    </div>

    <div class="items-center rounded-b border-t border-gray-200 p-6 dark:border-gray-700">
      <div class="mt-8 text-right">
        <button
          type="button"
          class="mr-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
          @click="props.handleCloseModal()">
          Cancel
        </button>
        <button
          v-if="$reservation.reservationId"
          type="button"
          class="btn-error mr-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
          @click="deleteReservation($reservation.reservationId)">
          Delete
        </button>
        <button
          type="submit"
          class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-semibold text-white shadow-sm hover:bg-gray-700">
          Save Reservation
        </button>
      </div>
    </div>
  </form>
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
