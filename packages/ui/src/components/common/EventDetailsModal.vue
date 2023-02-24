<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getReservationById } from '../../stores/reservation';
import {
  initReservationFormValues,
  updateReservationDates,
  updateReservationGuests,
} from '../../stores/reservationForm';
import DatesAndGuests from '../ReservationForm/DatesAndGuests.vue';
// import { useTheme } from '../../composables/useTheme';
import type { ReservationValues } from '../../../types/Reservation';

const props = defineProps<{
  showModal: boolean;
  reservationId?: string;
  handleCloseModal: () => void;
}>();

// const { isDark } = useTheme();

const reservationDetails = ref<ReservationValues>(initReservationFormValues);

const modalTitlePrefix = ref('Add');

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

const addReservation = () => {
  console.log('Add event');
};

onMounted(() => {
  if (props.reservationId) {
    const existingReservation = getReservationById(props.reservationId);
    if (existingReservation && Object.keys(existingReservation).length) {
      modalTitlePrefix.value = 'Edit';
      reservationDetails.value = existingReservation;
      updateReservationDates(existingReservation.dates);
      updateReservationGuests(existingReservation.guests);
    }
  }
  // else {
  //   reservationDetails.value = initialReservationValues;
  // }
});
</script>

<template>
  <Transition name="modal">
    <div v-show="showModal" class="modal modal-bottom sm:modal-middle is-visible">
      <div class="w-11/12 max-w-5xl modal-box">
        <h3 class="pb-2 mb-6 text-2xl font-bold border-b">{{ modalTitlePrefix }} reservation details</h3>

        <div class="w-full max-w-xs mb-6 form-control">
          <label class="label">
            <span class="label-text">Reservation name</span>
          </label>
          <input
            type="text"
            placeholder="Who is requesting the reservation?"
            class="w-full max-w-xs bg-white input input-bordered dark:bg-gray-700"
            :value="reservationDetails.name"
          />
        </div>

        <div class="mb-4 -mx-4">
          <DatesAndGuests />
        </div>

        <div class="mt-8 text-right">
          <button
            type="button"
            class="px-4 py-2 mr-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
            @click="props.handleCloseModal()"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 font-semibold text-white bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:bg-gray-700"
            @click="addReservation()"
          >
            Save Reservation
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
