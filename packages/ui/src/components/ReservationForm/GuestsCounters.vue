<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { decrementGuestsCounter, incrementGuestsCounter, reservationGuests } from '../../stores/reservationForm';
import Counter from '../common/Counter.vue';

const reservationGuestsStore = useStore(reservationGuests);

const bookingGuestsItems = [
  {
    type: 'adults',
    subtitle: 'Ages 13 or above',
    maxValue: 16,
  },
  {
    type: 'children',
    subtitle: 'Ages 2-12',
    maxValue: 5,
  },
  {
    type: 'infants',
    subtitle: 'Under 2',
    maxValue: 5,
  },
  {
    type: 'pets',
    subtitle: 'Fury friends welcome',
    maxValue: 5,
  },
];
</script>

<template>
  <div v-for="item in bookingGuestsItems">
    <div class="flex items-center pb-4 border-b border-gray-200 gap-x-8 border-opacity-70">
      <div class="flex-grow">
        <h2 class="font-medium text-gray-800 capitalize">{{ item.type }}</h2>
        <p class="text-sm leading-4 text-gray-400">{{ item.subtitle }}</p>
      </div>
      <Counter
        :value="reservationGuestsStore[item.type]"
        :handleOnIncrement="() => incrementGuestsCounter(item.type)"
        :handleOnDecrement="() => decrementGuestsCounter(item.type)"
      />
    </div>
  </div>
</template>
