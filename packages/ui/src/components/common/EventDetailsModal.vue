<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';
import { computed, ref, Transition } from 'vue';
// import { useTheme } from '../../composables/useTheme';
import type { ReservationDetails } from '../../types/Reservation';

const props = defineProps<{
  showModal: boolean;
  reservationDetails: ReservationDetails;
  handleCloseModal: () => void;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual('sm');

// const { isDark } = useTheme();

const modalTitlePrefix = computed(() => (props.reservationDetails.name ? 'Edit' : 'Add'));

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

const addReservation = () => {
  console.log('Add event');
};

// let modalReservationDetails;
// onMounted(() => {
//   modalReservationDetails = props.reservationDetails;
// });
</script>

<template>
  <Transition name="modal">
    <div v-if="showModal" class="z-50 modal modal-bottom sm:modal-middle is-visible">
      <div class="modal-box">
        <h3 class="pb-2 mb-6 text-2xl font-bold border-b">{{ modalTitlePrefix }} reservation details</h3>

        <div class="w-full max-w-xs mb-8 form-control">
          <label class="label">
            <span class="label-text">Reservation name</span>
          </label>
          <input
            type="text"
            placeholder="Who is requesting the reservation?"
            class="w-full max-w-xs bg-white input input-bordered dark:bg-gray-700"
            :value="props.reservationDetails.name"
          />
        </div>

        <div class="mb-4">
          <DatePicker
            v-model="props.reservationDetails.dates"
            color="green"
            :columns="smAndLarger ? 2 : 1"
            :rows="smAndLarger ? 1 : 2"
            :select-attribute="selectDragAttribute"
            :drag-attribute="selectDragAttribute"
            is-range
            @drag="dragValue = $event"
          >
            <!-- :isDark="isDark" -->
            <template v-slot:day-popover="{ format }">
              <div>
                {{ format(dragValue ? dragValue.start : props.reservationDetails.dates.start, 'MMM D') }}
                -
                {{ format(dragValue ? dragValue.end : props.reservationDetails.dates.end, 'MMM D') }}
              </div>
            </template>

            <template v-slot="{ inputValue, togglePopover }">
              <div class="grid flex-grow grid-cols-[1fr,1fr] gap-x-8 items-center h-full">
                <div class="w-full max-w-xs form-control">
                  <label class="label" role="button" tabindex="0" @click="togglePopover()">
                    <span class="label-text">Check in</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Select date"
                    :value="inputValue.start"
                    class="w-full max-w-xs bg-white input input-bordered dark:bg-gray-700"
                  />
                </div>

                <div class="w-full max-w-xs form-control">
                  <label class="label" role="button" tabindex="0" @click="togglePopover()">
                    <span class="label-text">Check out</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Select date"
                    :value="inputValue.end"
                    class="w-full max-w-xs bg-white input input-bordered dark:bg-gray-700"
                  />
                </div>
              </div>
            </template>
          </DatePicker>
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
