<script lang="ts" setup>
// import { useVModel } from '@vueuse/core';
import type { InputSize } from './types';

interface InputProps {
  label?: string;
  disabled?: boolean;
  type?:
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';
  size?: InputSize;
  modelValue: string;
  labelFor: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  label: '',
  disabled: false,
  type: 'text',
  size: 'md',
  modelValue: '',
  labelFor: '',
});

// const model = useVModel(props, 'modelValue');
</script>

<template>
    <label v-if="label" class="label" :for="labelFor">
      <span class="label-text">{{ label }}</span>
    </label>
      <div
        v-if="$slots.prefix"
        class="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center overflow-hidden pl-3">
        <slot name="prefix" />
      </div>
      <input
        class="input input-bordered invalid:input-error w-full max-w-xs"
        v-bind="$attrs"
        :disabled="disabled"
        :type="type"
      />
      <div v-if="$slots.suffix" class="absolute bottom-2.5 right-2.5">
        <slot name="suffix" />
      </div>
    <p v-if="$slots.helper" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      <slot name="helper" />
    </p>
</template>
