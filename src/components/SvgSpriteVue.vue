<script setup lang="ts">
	import { BASE_APP_URL } from '@/app/constants';

	interface Props {
		name: string;
		iconClass?: string;
	}

	const props = defineProps<Props>();

	const ICON_URL = `${BASE_APP_URL}assets/images/sprite.svg#${props.name}`;
</script>

<template>
	<svg :class="iconClass">
		<use :xlink:href="ICON_URL"></use>
	</svg>
</template>
