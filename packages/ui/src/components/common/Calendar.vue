<script setup lang="ts">
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';
import { computed, ref, Teleport } from 'vue';
import { reservations } from '../../stores/reservation';

const calendar = ref(null);
const $reservations = reservations.get();

const today = computed(() => {
  if ($reservations?.length > 0) {
    return [
      {
        key: 'today',
        highlight: {
          fillMode: 'solid',
          style: {
            backgroundColor: 'green',
          },
        },
        dates: new Date(),
      },
    ];
  } else {
    return [];
  }
});

const disabledDates = computed(() => [
  ...$reservations.map((r) => {
    return r.dates;
  }),
]);

console.log('disabledDates', disabledDates);
const attrs = computed(() => [
  ...$reservations.map((r) => {
    return {
      key: r.id,
      dates: r.dates,
    };
  }),
  ...today.value,
]);

console.log('reservations', $reservations);
console.log('attrs', attrs);
const masks = ref({
  weekdays: 'WWW',
});

const showModal = ref(false);
const selectedReservationDetails = ref({});

const handleEditReservation = (day, reservationId = null) => {
  console.log('DAY', day);
  if (reservationId) {
    // const reservationDetails = reservations.find((r) => r.key === reservationId)?.reservationDetails;
    // selectedReservationDetails.value = Object.assign({}, reservationDetails);
  } else {
    selectedReservationDetails.value = Object.assign({}, { name: null, range: { start: day.date, end: day.date } });
  }

  showModal.value = true;
};

const handleCloseModal = () => {
  showModal.value = false;
};
</script>

<template>
  <Calendar
    ref="calendar"
    class="max-w-full overflow-hidden bg-white rounded-lg shadow-xl custom-calendar dark:bg-neutral-focus"
    :masks="masks"
    :attributes="attrs"
    :disabled-dates="disabledDates"
    disable-page-swipe
    is-expanded
    title-position="left"
    @dayclick="handleEditReservation"
  >
    <template v-slot:header-title="{ monthLabel, yearLabel }">
      <div class="self-center text-lg font-thin text-base-content">
        <span class="font-bold">{{ monthLabel }}</span> {{ yearLabel }}
      </div>
    </template>
  </Calendar>

  <Teleport to="body">
    <EventDetailsModal
      :showModal="showModal"
      :reservation-details="selectedReservationDetails"
      :handleCloseModal="handleCloseModal"
    />
  </Teleport>
</template>
