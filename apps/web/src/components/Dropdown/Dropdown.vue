<script lang="ts" setup>
import Button from '@/components/Button/Button.vue';
import SlotListener from '@/components/utils/SlotListener/SlotListener.vue';
import { onClickOutside } from '@vueuse/core';
import type { PropType } from 'vue';
import { computed, ref, toRef } from 'vue';
import { useDropdownClasses } from './composables/useDropdownClasses';
import type { DropdownPlacement } from './types';

const visible = ref(false);

const onShow = () => (visible.value = true);
const onHide = () => (visible.value = false);
const onToggle = () => (visible.value = !visible.value);

const props = defineProps({
  placement: {
    type: String as PropType<DropdownPlacement>,
    default: 'bottom',
  },
  text: {
    type: String,
    default: '',
  },
  transition: {
    type: [String, null] as PropType<string | null>,
    default: null,
  },
});

const placementTransitionMap: Record<DropdownPlacement, string> = {
  bottom: 'to-bottom',
  left: 'to-left',
  right: 'to-right',
  top: 'to-top',
};

const transitionName = computed(() => {
  if (props.transition === null) return placementTransitionMap[props.placement];
  return props.transition;
});

const content = ref<HTMLDivElement>();
const wrapper = ref<HTMLDivElement>();

const { contentClasses, contentStyles } = useDropdownClasses({
  placement: toRef(props, 'placement'),
  visible,
  contentRef: content,
});

onClickOutside(wrapper, () => {
  if (!visible.value) return;
  visible.value = false;
});
</script>

<style scoped src="./Dropdown.css"></style>

<template>
  <div class="relative inline-flex" ref="wrapper">
    <div class="inline-flex items-center">
      <slot-listener @click="onToggle">
        <slot name="trigger">
          <Button>
            {{ text }}
            <template #suffix>
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </template>
          </Button>
        </slot>
      </slot-listener>
    </div>
    <transition :name="transitionName">
      <div ref="content" v-if="visible" :style="contentStyles" :class="[contentClasses]">
        <slot-listener @click="onHide">
          <slot />
        </slot-listener>
      </div>
    </transition>
  </div>
</template>
