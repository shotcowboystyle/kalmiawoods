<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { reservationFormStep } from '../../stores/reservationFormWithTransition';

const step = useStore(reservationFormStep);
</script>

<template>
  <div v-if="step === 3">
    <div class="mb-5">
      <h3>Confirmation</h3>
    </div>
  </div>
</template>
