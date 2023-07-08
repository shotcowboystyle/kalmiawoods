<script lang="ts" setup>
import type { InputSize } from '@/components/Input/types'
import { computed, toRefs } from 'vue'
import { useSelectClasses } from './composables/useSelectClasses'
import type { OptionsType } from './types'

interface InputProps {
  modelValue?: string
  label?: string
  options?: OptionsType[]
  placeholder?: string
  disabled?: boolean
  underline?: boolean
  size?: InputSize
}
const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  label: '',
  options: () => [],
  placeholder: 'Please select one',
  disabled: false,
  underline: false,
  size: 'md'
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const { underlineClasses, labelClasses } = useSelectClasses(toRefs(props))
</script>

<template>
  <label v-if="label" :class="labelClasses">{{ label }}</label>
  <select v-model="model" :disabled="disabled" class="select select-bordered">
    <option disabled selected>{{ placeholder }}</option>
    <option
      :value="option.value"
      v-for="(option, index) in options"
      :key="index">
      {{ option.name }}
    </option>
  </select>
</template>
