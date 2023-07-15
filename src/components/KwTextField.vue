<script setup>
import { useVModel } from '@vueuse/core';

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
  validationMatchers: Array,
  errorMessagePrefix: String,
});

const model = useVModel(props, 'modelValue');
const error = ref(false);
const errorMessage = ref('');
const formValidator = useFormValidator();
const kalmiaWoodsForm = inject('kalmiaWoodsForm', undefined);
const input = ref(null);

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
    <label :for="$attrs.id" class="label">
      <span class="label-text">{{ label }}</span>
      <span v-if="labelAlt" class="label-text-alt">{{ labelAlt }}</span>
    </label>
    <input
      ref="input"
      v-bind="$attrs"
      v-model="model"
      @input="checkError"
      class="input input-bordered w-full max-w-xs"
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
