<script setup lang="ts">
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
  selectedDate: undefined,
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

const isSubmitting = ref(false);
const hasErrors = ref(false);
const formValues = reactive({
  reservationId: props.isEditingReservation ? $reservation.value.reservationId : null,
  userId: props.isEditingReservation && $reservation.value.userId ? $reservation.value.userId : undefined,
  range: {
    start: props.isEditingReservation ? $reservation.value.checkInDate : props.selectedDate,
    end: props.isEditingReservation ? $reservation.value.checkOutDate : props.selectedDate,
  },
});

function invalidateForm() {
  hasErrors.value = true;
}

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
  // placement: 'auto',
});

// const bodyEl = ref();
const usersList = ref();
const { arrivedState } = useScroll(usersList);

async function submit() {
  isSubmitting.value = true;

  const response = await fetch('/api/reservations', {
    method: props.isEditingReservation ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues),
  });

  if (response.status === 200) {
    const data = await response.json();
    addReservation(data);
    props.handleCloseModal();
  }
}

const isDeleting = ref(false);
async function deleteReservation(reservationId) {
  isDeleting.value = true;

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
  <form @submit.prevent="submit" :class="[{ errors: hasErrors }]">
    <DatePicker
      v-model.range="formValues.range"
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
          <div class="mb-4 grid h-full flex-grow grid-cols-[1fr,1fr] items-center gap-8 px-0">
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

    <div v-if="isAdmin" class="form-control w-full mb-6">
      <label for="userId" class="label">
        <span class="label-text">Main guest</span>
      </label>
      <select
        v-model="formValues.userId"
        id="userId"
        name="userId"
        class="select select-bordered w-full max-w-xs"
        required>
        <option disabled selected>Who shot first?</option>
        <option v-for="(option, idx) in selectUserOptions" :key="idx" :value="option.value">{{ option.name }}</option>
      </select>
    </div>

    <div class="mb-4 w-auto block max-w-fit">
      <p class="label-text mb-1">Locations</p>
      <div class="form-control">
        <label class="label cursor-pointer justify-normal">
          <input type="checkbox" class="checkbox mr-2" />
          <span class="label-text">Main house</span>
        </label>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer justify-normal">
          <input type="checkbox" class="checkbox mr-2" />
          <span class="label-text">Workshop</span>
        </label>
      </div>
    </div>

    <div class="mt-16 flex justify-evenly">
      <button
        v-if="$reservation.reservationId"
        type="button"
        class="btn btn-error"
        @click="deleteReservation($reservation.reservationId)"
        :disabled="isDeleting">
        <span v-if="isDeleting" class="loading loading-spinner"></span>
        <span v-else>Delete</span>
      </button>

      <div class="flex justify-end grow gap-4">
        <button type="button" class="btn btn-link" @click="props.handleCloseModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="loading loading-spinner"></span>
          <span v-else>Save Reservation</span>
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
