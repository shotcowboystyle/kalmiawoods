<script setup lang="ts">
	defineProps<{
		text: string;
		loading?: boolean;
		variant?: string;
		size?: string;
		iconLeft?: string;
		iconRight?: string;
	}>();

	const variants: {
		neutral: string;
		primary: string;
		secondary: string;
		accent: string;
		ghost: string;
		link: string;
		danger: string;
	} = {
		neutral: 'btn-neutral',
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		accent: 'btn-accent',
		ghost: 'btn-ghost',
		link: 'btn-link',
		danger: 'btn-error',
	};

	const sizes: {
		xs: string;
		sm: string;
		lg: string;
		block: string;
		base: string;
		responsive: string;
	} = {
		xs: 'btn-xs',
		sm: 'btn-sm',
		lg: 'btn-lg',
		block: 'btn-block',
		base: '',
		responsive: 'btn-xs sm:btn-sm md:btn-md lg:btn-lg',
	};
</script>

<template>
	<button
		type="button"
		class="btn"
		:class="[variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes]]"
	>
		<KwSpinner
			v-if="loading && !iconRight"
			class="h-4 w-4 border-[2px]"
		/>
		<!-- <font-awesome-icon v-else-if="iconLeft" class="text-base" :icon="iconLeft" /> -->
		<span v-if="text"> {{ text }}</span>
		<KwSpinner
			v-if="loading && iconRight"
			class="h-4 w-4 border-[2px]"
		/>
		<!-- <font-awesome-icon v-else-if="iconRight" class="text-base" :icon="iconRight" /> -->
	</button>
</template>
