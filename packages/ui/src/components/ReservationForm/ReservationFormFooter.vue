<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { nextStep, prevStep, reservationFormStep } from '../../stores/reservationForm';

const step = useStore(reservationFormStep);
</script>

<template v-if="step != 'complete'">
  <div class="fixed bottom-0 left-0 right-0 z-50 py-5 bg-white shadow-md dark:bg-gray-800">
    <div class="max-w-3xl px-4 mx-auto">
      <div class="flex justify-between">
        <div class="w-1/2">
          <button v-if="step > 1" class="btn btn-outline" @click="prevStep">Previous</button>
        </div>

        <div class="w-1/2 text-right">
          <button v-if="step < 3" class="btn btn-primary" @click="nextStep">Next</button>
          <button v-if="step === 3" class="btn btn-primary" @click="nextStep">Complete</button>
        </div>
      </div>
    </div>
  </div>
</template>
