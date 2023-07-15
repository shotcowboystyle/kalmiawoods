<script setup>
const props = defineProps({
  title: String,
  description: String,
  variant: {
    type: String,
    default: 'danger',
  },
  buttons: Array,
  time: Number,
});
const emit = defineEmits(['close']);

const variants = {
  info: 'alert-info',
  success: 'alert-success',
  danger: 'alert-error',
};

function closeWhenTimeExpires() {
  if (props.time > 0) {
    setTimeout(() => {
      emit('close');
    }, props.time);
  }
}

closeWhenTimeExpires();
</script>

<template>
  <div class="alert" :class="[variants[variant]]" role="alert">
    <KwIconButton class="absolute right-[8px] top-[10px]" icon="xmark" @click="$emit('close')" />
    <div class="flex items-center">
      <!-- <font-awesome-icon
        v-if="variant === 'success'"
        icon="circle-check"
        class="mr-2 h-[16px] w-[16px] text-green-600"
      />
      <font-awesome-icon
        v-if="variant === 'danger'"
        icon="circle-xmark"
        class="mr-2 h-[16px] w-[16px] text-red-600"
      /> -->
      <div class="pr-[40px] text-sm font-semibold">{{ title }}</div>
    </div>
    <p v-if="description" class="mb-2 mt-2 text-sm font-normal">
      {{ description }}
    </p>
    <div v-if="buttons?.length > 0" class="actions mt-2 flex flex-wrap items-center">
      <KwButton v-for="button in buttons" :variant="variant" :text="button.text" @click="button.click" />
    </div>
  </div>
</template>
