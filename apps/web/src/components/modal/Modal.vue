<script lang="ts" setup>
import { generateId } from '@/utils/generate-id';
import { onKeyStroke } from '@vueuse/core';
import type { PropType } from 'vue';
import type { ModalPosition, ModalSize } from './types';

defineProps({
  children: {
    type: Array,
    default() {
      return [];
    },
  },
  popup: {
    type: Boolean,
    default: false,
  },
  // isModalOpen: {
  //   type: Boolean,
  //   default: false,
  // },
  position: {
    type: String as PropType<ModalPosition>,
    default: 'center',
  },
  size: {
    type: String as PropType<ModalSize>,
    default: '2xl',
  },
});

const modalRef = ref();

const emit = defineEmits(['close']);

const modalSizeClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

function closeModal() {
  emit('close');
}

onMounted(() => {
  onKeyStroke(['Escape'], () => {
    closeModal();
  });
});

const modalId = generateId(4);
</script>

<template>
  <!-- <dialog :id="modalId" class="modal" :open="isModalOpen"> -->
  <dialog :id="modalId" class="modal" open>
    <form method="dialog" class="modal-box bg-base-100" :class="`${modalSizeClasses[size]}`" ref="modalRef">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
      <slot class="font-bold text-lg" name="header" />
      <slot class="pt-8 pb-4" name="body" />
    </form>
    <form method="dialog" class="modal-backdrop" @click="closeModal">
      <slot name="footer">
        <button>close</button>
      </slot>
    </form>
  </dialog>
</template>
