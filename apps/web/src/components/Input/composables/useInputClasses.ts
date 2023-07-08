import { simplifyTailwindClasses } from '@/utils/simplifyTailwindClasses';
import type { Ref } from 'vue';
import { computed } from 'vue';
import type { InputSize } from '../types';

// LABEL
const defaultLabelClasses = 'label';

// INPUT
const defaultInputClasses = 'input input-bordered w-full max-w-xs';
// const disabledInputClasses = 'cursor-not-allowed bg-gray-100';
const disabledInputClasses = '';
const inputSizeClasses: Record<InputSize, string> = {
  lg: 'p-4',
  md: 'p-2.5 text-sm',
  sm: 'p-2 text-sm',
};

export interface UseInputClassesProps {
  size: Ref<InputSize>;
  disabled: Ref<boolean>;
}

export function useInputClasses(props: UseInputClassesProps): {
  inputClasses: Ref<string>;
  labelClasses: Ref<string>;
} {
  const inputClasses = computed(() =>
    simplifyTailwindClasses(
      defaultInputClasses,
      inputSizeClasses[props.size.value],
      props.disabled.value ? disabledInputClasses : '',
    ),
  );

  const labelClasses = computed(() => defaultLabelClasses);

  return {
    inputClasses,
    labelClasses,
  };
}
