<script setup>
import KwToastCard from './KwToastCard.vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

function removeItem(index) {
  const updatedValue = props.modelValue;
  updatedValue.splice(index, 1);
  emit('update:modelValue', updatedValue);
}
</script>

<template>
  <TransitionGroup
    tag="div"
    class="pointer-events-none fixed top-0 z-50 flex h-screen w-screen flex-col-reverse items-start p-4"
    name="toast">
    <KwToastCard
      v-for="(item, i) in modelValue"
      :key="item"
      :title="item.title"
      :description="item.description"
      :variant="item.variant"
      :actions="item.actions"
      :buttons="item.buttons"
      :time="item.time"
      class="pointer-events-auto mt-4 max-w-[400px] toast toast-top toast-center"
      @close="removeItem(i)" />
  </TransitionGroup>
</template>

<style>
.toast-move,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-30px, -30px);
}
.toast-leave-active {
  position: absolute;
}
</style>
