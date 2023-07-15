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
      <span v-if="variant === 'success'" class="mr-2 h-[16px] w-[16px] text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
          <path
            d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M352 176L217.6 336L160 272"></path>
        </svg>
      </span>
      <span v-if="variant === 'danger'" class="mr-2 h-[16px] w-[16px] text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
          <path
            d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M320 320L192 192"></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M192 320l128-128"></path>
        </svg>
      </span>
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
