<script setup>
import { useVModel } from '@vueuse/core';

defineOptions({ inheritAttrs: false });
const props = defineProps({
  class: [String, Array, Object],
  label: String,
  required: Boolean,
  rules: Array,
  disabled: Boolean,
  modelValue: Array,
  options: Object,
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
    match: props.validationMatch,
    matchers: props.validationMatchers,
    errorMessagePrefix: props.errorMessagePrefix,
  });
  error.value = !validated.isValid;
  errorMessage.value = validated.errorMessage;
}

function handleSelectAll() {
  model.value = props.options.map((option) => option.value);
}
</script>

<template>
  <!--eslint-disable-next-line vue/no-parsing-error-->
  <fieldset :class="class">
    <legend class="label mb-1 w-full">
      <span
        class="label-text"
        :class="{
          required: required,
        }">
        {{ label }}
      </span>
      <button type="button" class="btn btn-link label-text-alt" @click="handleSelectAll">Select all</button>
    </legend>

    <div v-for="option in options" :key="option.value" class="form-control">
      <label class="cursor-pointer label justify-normal" :for="option.value">
        <!-- @input="checkError" -->
        <input
          ref="input"
          v-bind="$attrs"
          :id="option.value"
          type="checkbox"
          class="checkbox"
          :class="{
            'checkbox-error': error,
          }"
          :name="option.value"
          :value="option.value"
          v-model="model" />
        <span class="label-text ml-2">{{ option.name }}</span>
      </label>
    </div>

    <div v-if="error" class="mt-2 text-sm font-normal text-red-600">
      {{ errorMessage }}
    </div>
  </fieldset>
</template>
