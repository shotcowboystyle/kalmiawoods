<script setup lang="ts">
// import { useStore } from '@nanostores/vue';
// import { shallowRef } from 'vue';
// import { reservationFormStep, reservationFormStepDirection } from '../../stores/reservationForm';
import DatesAndGuests from './DatesAndGuests.vue';
import ReservationConfirmation from './ReservationConfirmation.vue';
import ReservationPayment from './ReservationPayment.vue';
import ReservationSuccess from './ReservationSuccess.vue';
</script>

<template>
  <section class="flex-grow w-full h-full mx-auto">
    <DatesAndGuests />
    <ReservationPayment />
    <ReservationConfirmation />
    <ReservationSuccess />
  </section>
</template>
