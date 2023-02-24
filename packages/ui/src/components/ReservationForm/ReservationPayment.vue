<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { activeReservationFormStep, setReservationFormActiveStep } from '../../stores/reservationForm';
import PaymentForm from '../PaymentForm/PaymentForm.vue';
import StepCompletedIcon from './StepCompletedIcon.vue';

const activeStep = useStore(activeReservationFormStep);
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="mb-4 bg-white border shadow-xl collapse border-base-300 dark:bg-base-100"
    :class="{ 'collapse-open': activeStep === 'payment' }"
    @click="setReservationFormActiveStep('payment')"
  >
    <div class="collapse-title">
      <div class="flex items-center justify-start gap-x-4">
        <StepCompletedIcon />
        <div class="flex-grow">
          <h3 class="text-xl font-bold leading-tight text-content">Payment</h3>
          <p class="mt-1 text-gray-400">Checkout with secure credit card processing.</p>
        </div>
      </div>
    </div>
    <div class="collapse-content">
      <div class="mb-5">
        <PaymentForm total="$200" />
      </div>
    </div>
  </div>
</template>
