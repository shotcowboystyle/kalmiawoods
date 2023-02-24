<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { reservationFormStep, reservationFormStepDirection } from '../../stores/reservationFormWithTransition';

const step = useStore(reservationFormStep);
const transitionDirection = useStore(reservationFormStepDirection);

type Section = {
  step: number | string;
  title: string;
};

const sections: Section[] = [
  { step: 1, title: 'Dates and Guests' },
  { step: 2, title: 'Payment' },
  { step: 3, title: 'Confirm' },
  { step: 'complete', title: 'Success' },
];
</script>

<template>
  <div class="py-4 border-b-2">
    <div class="mb-1 text-xs font-bold leading-tight tracking-wide text-gray-500 uppercase">
      Step: {{ step === 'complete' ? 4 : step }} of {{ sections.length }}
    </div>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex-1">
        <template v-for="section in sections" :key="section.step">
          <Transition :name="transitionDirection">
            <span
              v-if="step === section.step"
              class="relative inline-block text-lg font-bold leading-tight min-w-min text-content"
              >{{ section.title }}</span
            >
          </Transition>
        </template>
      </div>

      <div class="flex items-center md:w-64">
        <div class="w-full mr-2 bg-white rounded-full">
          <div
            class="h-2 text-xs leading-none text-center text-white bg-green-500 rounded-full transition-[width]"
            :style="'width: ' + (step === 'complete' ? 1 : Number(step) / sections.length) * 100 + '%'"
          ></div>
        </div>
        <div class="w-10 text-xs text-gray-500">
          {{ Math.floor((step === 'complete' ? 1 : Number(step) / sections.length) * 100) }}%
        </div>
      </div>
    </div>
  </div>
</template>
