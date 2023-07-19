<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

import { theme } from '@/stores/app';
import { addReservation, removeReservation, reservation, reservedDates } from '@/stores/reservation';
import { users } from '@/stores/user';
import { fetchDelete, fetchPost, fetchPut } from '@/utils/fetchClient';

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

const toast: { error: Function } | undefined = inject('toast');

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greater('sm');
const colorMode = useStore(theme);

const $reservation = useStore(reservation);
const $users = useStore(users);

const buildingsOptions = [
  {
    value: 'HOUSE',
    name: 'Main house',
  },
  {
    value: 'GARAGE',
    name: 'Garage',
  },
  {
    value: 'WORKSHOP',
    name: 'Workshop',
  },
];

const selectUserOptions = computed(() => [
  ...Object.values($users.value)?.map((u) => {
    return {
      value: u?.userId,
      name: `${u?.firstName} ${u?.lastName}`,
    };
  }),
]);

const submitButtonText = props.isEditingReservation ? 'Update' : 'Create';
const isSubmitting = ref(false);
const formData = reactive({
  reservationId: props.isEditingReservation ? $reservation.value.reservationId : null,
  userId: props.isEditingReservation && $reservation.value.userId ? $reservation.value.userId : undefined,
  title: props.isEditingReservation && $reservation.value.title ? $reservation.value.title : undefined,
  buildings: props.isEditingReservation && $reservation.value.buildings ? $reservation.value.buildings : ['HOUSE'],
  range: {
    start: props.isEditingReservation ? $reservation.value.checkInDate : props.selectedDate,
    end: props.isEditingReservation ? $reservation.value.checkOutDate : props.selectedDate,
  },
});

const disabledDates = useStore(reservedDates);

const popover = ref({
  visibility: 'click',
});

async function submit() {
  isSubmitting.value = true;

  try {
    const response = props.isEditingReservation
      ? await fetchPut(`reservations/${$reservation.value.reservationId}`, formData)
      : await fetchPost('reservations', formData);
    const data = await response.json();
    addReservation(data);
    props.handleCloseModal();
  } catch (error: any) {
    console.log('error', error);
    toast?.error(error.message);
  } finally {
    isSubmitting.value = false;
  }
}

const isDeleting = ref(false);
async function deleteReservation(reservationId: string) {
  isDeleting.value = true;

  try {
    await fetchDelete(`reservations/${reservationId}`);
    removeReservation(reservationId);
    props.handleCloseModal();
  } catch (error: any) {
    console.log('error', error);
    toast?.error(error.message);
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <KwForm @submit="submit">
    <DatePicker
      v-model.range="formData.range"
      :class="{ 'border-0': smAndLarger }"
      color="green"
      :columns="smAndLarger ? 2 : 1"
      :min-date="new Date()"
      is-range
      is-required
      :is-dark="colorMode === 'dark'"
      :popover="popover"
      :is-expanded="smAndLarger"
      :trim-weeks="!smAndLarger"
      :disabled-dates="disabledDates">
      <template #default="{ inputValue, inputEvents }">
        <div class="flex items-center justify-center">
          <div class="mb-4 grid h-full flex-grow grid-cols-[1fr,1fr] items-center gap-8 px-0">
            <KwTextField
              type="text"
              class="w-full form-control"
              label="Check in"
              name="checkInDate"
              id="checkInDate"
              placeholder="Select date"
              :value="inputValue.start"
              v-on="inputEvents.start"
              required />

            <KwTextField
              type="text"
              class="w-full form-control"
              label="Check out"
              name="checkOutDate"
              id="checkOutDate"
              placeholder="Select date"
              :value="inputValue.end"
              v-on="inputEvents.end"
              required />
          </div>
        </div>
      </template>
    </DatePicker>

    <div v-if="isAdmin" class="w-full mb-6 form-control">
      <KwSelectField
        class="w-full max-w-xs form-control"
        label="Main Guest"
        name="userId"
        id="userId"
        optionDescription="Select user to link reservation to"
        :options="selectUserOptions"
        v-model="formData.userId"
        required />
    </div>

    <KwTextField
      type="text"
      class="w-full max-w-xs mb-4 form-control"
      label="Title"
      name="title"
      id="title"
      bottomLabelLeft="ie., Marge and the kids"
      v-model="formData.title" />

    <KwCheckboxGroup
      class="block w-auto mb-4 max-w-fit"
      label="Locations"
      :options="buildingsOptions"
      v-model="formData.buildings"
      required />

    <div class="flex mt-16 justify-evenly">
      <KwButton
        v-if="$reservation.reservationId"
        variant="danger"
        text="Delete"
        icon-left="arrow-left"
        @click="deleteReservation($reservation.reservationId)"
        :disabled="isDeleting"
        :loading="isDeleting" />

      <div class="flex justify-end gap-4 grow">
        <button type="button" class="btn btn-link hidden md:flex" @click="props.handleCloseModal()">Cancel</button>
        <KwButton
          variant="primary"
          :text="submitButtonText"
          type="submit"
          :disabled="isSubmitting"
          :loading="isSubmitting" />
      </div>
    </div>
  </KwForm>
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
