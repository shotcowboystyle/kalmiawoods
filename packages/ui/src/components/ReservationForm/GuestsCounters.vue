<script setup lang="ts">
import { RESERVATION_GUESTS_OPTIONS } from '@kalmiawoods/constants';
import { useStore } from '@nanostores/vue';
import { decrementGuestsCounter, incrementGuestsCounter, reservationGuests } from '../../stores/reservationForm';
import InputCounter from '../common/InputCounter.vue';

const reservationGuestsStore = useStore(reservationGuests);
</script>

<template>
  <div v-for="{ key, description, maxValue } in RESERVATION_GUESTS_OPTIONS" :key="key">
    <div class="flex items-center pb-4 border-b border-gray-200 gap-x-8 border-opacity-70">
      <div class="flex-grow">
        <h2 class="font-medium text-gray-800 capitalize">{{ key }}</h2>
        <p class="text-sm leading-4 text-gray-400">{{ description }}</p>
      </div>
      <InputCounter
        :value="reservationGuestsStore[key]"
        :max-value="maxValue"
        :handle-on-increment="() => incrementGuestsCounter(key)"
        :handle-on-decrement="() => decrementGuestsCounter(key)"
      />
    </div>
  </div>
</template>
