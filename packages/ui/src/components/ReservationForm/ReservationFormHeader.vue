<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { computed } from 'vue';
import { percentComplete, reservationFormStep } from '../../stores/reservationForm';

const step = useStore(reservationFormStep);

type Section = {
  step: number;
  title: string;
};

const sections: Section[] = [
  { step: 1, title: 'Dates and Guests' },
  { step: 2, title: 'Payment' },
  { step: 3, title: 'Confirm' },
];

const $percentComplete = computed(() => percentComplete());
</script>

<template>
  <div class="py-4 border-b-2">
    <div class="mb-1 text-xs font-bold leading-tight tracking-wide text-gray-500 uppercase">Step: {{ step }} of 3</div>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex-1">
        <template v-for="section in sections">
          <div v-if="step === section.step">
            <div class="text-lg font-bold leading-tight text-content">{{ section.title }}</div>
          </div>
        </template>
      </div>

      <div class="flex items-center md:w-64">
        <div class="w-full mr-2 bg-white rounded-full">
          <div
            class="h-2 text-xs leading-none text-center text-white bg-green-500 rounded-full"
            :style="'width: ' + $percentComplete + '%'"
          ></div>
        </div>
        <div class="w-10 text-xs text-gray-500">{{ Math.floor($percentComplete) }}%</div>
      </div>
    </div>
  </div>
</template>
