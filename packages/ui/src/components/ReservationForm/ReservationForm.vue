<script setup lang="ts">
import Confirmation from './Confirmation.vue';
import DatesAndGuests from './DatesAndGuests.vue';
// import Payment from './Payment.vue';
import ReservationFormHeader from './ReservationFormHeader.vue';
</script>

<template>
  <section class="flex-grow h-full py-8 mx-auto bg-white drop-shadow-lg sm:px-4 md:max-w-4xl dark:bg-base-100">
    <div class="p-1 mx-auto sm:px-4 sm:py-10 md:max-w-3xl">
      <div class="hidden">
        <div class="flex items-center justify-between p-10 bg-white rounded-lg shadow">
          <div>
            <svg class="w-20 h-20 mx-auto mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              ></path>
            </svg>

            <h2 class="mb-4 text-2xl font-bold text-center text-gray-800">Registration Success</h2>

            <div class="mb-8 text-gray-600">
              Thank you. We have sent you an email to demo@demo.test. Please click the link in the message to activate
              your account.
            </div>

            <button
              class="block w-40 px-5 py-2 mx-auto font-medium text-center text-gray-600 bg-white border rounded-lg shadow-sm focus:outline-none hover:bg-gray-100"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>

      <div id="booking-form-wrapper">
        <ReservationFormHeader />

        <div class="py-10">
          <DatesAndGuests />
          <!-- <Payment /> -->
          <Confirmation />
        </div>
      </div>
    </div>
  </section>
</template>
