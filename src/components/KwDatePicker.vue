<script setup>
import { useStore } from '@nanostores/vue';
import { breakpointsTailwind, useBreakpoints, useVModel } from '@vueuse/core';
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

import { theme } from '@/stores/app';
import { reservedDates } from '@/stores/reservations';

defineOptions({ inheritAttrs: false });
const props = defineProps({
  class: [String, Array, Object],
  label: String,
  labelAlt: String,
  bottomLabelLeft: String,
  bottomLabelRight: String,
  required: Boolean,
  rules: Array,
  disabled: Boolean,
  modelValue: String,
  validationMatch: String,
  validationMatchers: Array,
  errorMessagePrefix: String,
});

const model = useVModel(props, 'modelValue');
const error = ref(false);
const errorMessage = ref('');
const formValidator = useFormValidator();
const kalmiaWoodsForm = inject('kalmiaWoodsForm', undefined);
const input = ref(null);

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greater('sm');
const colorMode = useStore(theme);
const disabledDates = useStore(reservedDates);

const popover = ref({
  visibility: 'click',
  // placement: 'auto',
});

watch(
  () => kalmiaWoodsForm,
  () => {
    checkError();
  },
  { deep: true },
);

function checkError() {
  if (!props.required && !props.rules?.length) {
    return;
  }

  const validated = formValidator.validate(model.value, formValidator.allRules(props.required, props.rules), {
    match: props.validationMatch,
    matchers: props.validationMatchers,
    errorMessagePrefix: props.errorMessagePrefix,
  });
  error.value = !validated.isValid;
  errorMessage.value = validated.errorMessage;

  if (error.value && input.value) {
    input.value.focus();
  }
}
</script>

<template>
  <!--eslint-disable-next-line vue/no-parsing-error-->
  <div :class="class">
    <DatePicker
      v-model.range="formData.range"
      :class="{ 'border-0': smAndLarger }"
      color="green"
      :columns="smAndLarger ? 2 : 1"
      :min-date="new Date()"
      is-range
      is-required
      :is-dark="colorMode === 'dark'"
      :popover="popover"
      :is-expanded="smAndLarger"
      :trim-weeks="!smAndLarger"
      :disabled-dates="disabledDates">
      <template #default="{ inputValue, inputEvents }">
        <div class="flex items-center justify-center">
          <div class="mb-4 grid h-full flex-grow grid-cols-[1fr,1fr] items-center gap-8 px-0">
            <div class="w-full form-control">
              <label for="checkInDate" class="label">
                <span class="label-text">Check in</span>
              </label>
              <input
                id="checkInDate"
                type="text"
                name="checkInDate"
                placeholder="Select date"
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="w-full input input-bordered" />
            </div>

            <div class="w-full form-control">
              <label for="checkOutDate" class="label">
                <span class="label-text">Check out</span>
              </label>
              <input
                id="checkOutDate"
                type="text"
                name="checkOutDate"
                placeholder="Select date"
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="w-full input input-bordered" />
            </div>
          </div>
        </div>
      </template>
    </DatePicker>

    <label :for="$attrs.id" class="label">
      <span class="label-text">{{ label }}</span>
      <span v-if="labelAlt" class="label-text-alt">{{ labelAlt }}</span>
    </label>
    <input
      ref="input"
      v-bind="$attrs"
      v-model="model"
      @input="checkError"
      class="w-full max-w-xs input input-bordered"
      :class="{
        'input-error': error,
      }"
      :disabled="disabled" />
    <!-- <font-awesome-icon v-if="disabled" class="absolute right-[12px] top-[13px] text-sm text-zinc-500" icon="lock" /> -->
    <label v-if="bottomLabelLeft || bottomLabelRight" :for="$attrs.id" class="label">
      <span v-if="bottomLabelLeft" class="label-text-alt">{{ bottomLabelLeft }}</span>
      <span v-if="bottomLabelRight" class="label-text-alt">{{ bottomLabelRight }}</span>
    </label>
    <div v-if="error" class="mt-2 text-sm font-normal text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>
