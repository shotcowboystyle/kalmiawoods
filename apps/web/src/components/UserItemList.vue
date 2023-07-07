<template>
  <div ref="bodyEl" class="h-full overflow-y-scroll">
    <div class="flex flex-col gap-y-2 md:gap-y-4">
      <div class="flex justify-center">
        <img :src="imgs[0]" class="border border-black shadow-md rounded-2xl" @load="handleImgLoad" />
      </div>

      <Lazy
        v-for="img in imgs.slice(1)"
        :key="img"
        :class="[showLazyItems ? 'flex justify-center' : 'h-screen']"
        :style="elStyle">
        <img :src="img" class="border border-black shadow-md rounded-2xl" />
      </Lazy>

      <h1
        v-if="sImgs.length > 0"
        class="p-1 mx-2 text-xl font-bold bg-white border-black shadow-md md:mx-0 md:p-3 md:text-5xl rounded-xl md:rounded-2xl">
        Additional Information
      </h1>

      <Lazy
        v-for="img in sImgs"
        :key="img"
        :class="[showLazyItems ? 'flex justify-center' : 'h-screen']"
        :style="elStyle">
        <img :src="img" class="border border-black shadow-md rounded-2xl" />
      </Lazy>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import { setViewMode, user } from '@/stores/user';

interface Props {
  mode?: string;
}
const props = withDefaults(defineProps<Props>(), { mode: 'latest' });

setViewMode(props.mode);

const $user = useStore(user);

const bodyEl = ref();
const showLazyItems = ref(false);
const elStyle = ref({});

const imgs = computed(() => $user.value?.files ?? []);
const sImgs = computed(() => $user.value?.staticFiles ?? []);

const handleImgLoad = (ev: Event) => {
  const { clientHeight, clientWidth } = (ev.target as HTMLImageElement).parentElement;
  elStyle.value = {
    height: `${clientHeight}px`,
    width: `${clientWidth}px`,
  };
  showLazyItems.value = true;
};
</script>
