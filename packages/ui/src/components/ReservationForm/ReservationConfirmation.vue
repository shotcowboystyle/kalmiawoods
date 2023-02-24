<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { activeReservationFormStep, setReservationFormActiveStep } from '../../stores/reservationForm';

const activeStep = useStore(activeReservationFormStep);
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="mb-4 bg-white border shadow-xl collapse border-base-300 dark:bg-base-100"
    :class="{ 'collapse-open': activeStep === 'confirmation' }"
    @click="setReservationFormActiveStep('confirmation')"
  >
    <div class="collapse-title">
      <h3 class="text-xl font-bold leading-tight text-content">Confirmation</h3>
    </div>
    <div class="collapse-content">
      <div class="mb-5">Confirm and save!</div>
    </div>
  </div>
</template>
