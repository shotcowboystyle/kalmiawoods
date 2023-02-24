<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { shallowRef } from 'vue';
import { reservationFormStep, reservationFormStepDirection } from '../../stores/reservationFormWithTransition';
import DatesAndGuests from './DatesAndGuests.vue';
import ReservationConfirmation from './ReservationConfirmation.vue';
import ReservationFormHeader from './ReservationFormHeader.vue';
import ReservationPayment from './ReservationPayment.vue';
import ReservationSuccess from './ReservationSuccess.vue';

const transitionDirection = useStore(reservationFormStepDirection);
const activeComponent = shallowRef(DatesAndGuests);

reservationFormStep.listen(() => {
  const step = reservationFormStep.get();

  if (step === 1) {
    activeComponent.value = DatesAndGuests;
  } else if (step === 2) {
    activeComponent.value = ReservationPayment;
  } else if (step === 3) {
    activeComponent.value = ReservationConfirmation;
  } else if (step === 'complete') {
    activeComponent.value = ReservationSuccess;
  }
});
</script>

<template>
  <section
    class="flex-grow w-full h-full p-4 mx-auto overflow-hidden bg-white sm:py-8 drop-shadow-lg sm:px-4 md:max-w-4xl dark:bg-base-100"
  >
    <div class="p-1 mx-auto sm:px-4 sm:py-10 md:max-w-3xl">
      <div id="booking-form-wrapper">
        <ReservationFormHeader />

        <div class="py-4 sm:py-10">
          <Transition :name="transitionDirection">
            <component :is="activeComponent"></component>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
