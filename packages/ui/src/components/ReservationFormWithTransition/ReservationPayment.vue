<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { reservationFormStep } from '../../stores/reservationFormWithTransition';
import PaymentForm from '../PaymentForm/PaymentForm.vue';

const step = useStore(reservationFormStep);
</script>

<template>
  <div v-if="step === 2">
    <div class="mb-5">
      <PaymentForm total="$200" />
    </div>
  </div>
</template>
