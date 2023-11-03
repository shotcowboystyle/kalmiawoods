<script setup lang="ts">
	import type { OptionsType } from '@/types/common';
	import { useVModel } from '@vueuse/core';

	defineOptions({ inheritAttrs: false });
	const props = defineProps<{
		label: string;
		labelAlt?: string;
		bottomLabelLeft?: string;
		bottomLabelRight?: string;
		required?: boolean;
		disabled?: boolean;
		modelValue: string;
		optionDescription?: string;
		options: OptionsType[];
	}>();

	const model = useVModel(props, 'modelValue');
	const error = ref(false);
	const errorMessage = ref('');
	const kalmiaWoodsForm = inject('kalmiaWoodsForm', undefined);
	const input = ref<HTMLInputElement | null>(null);

	watch(
		() => kalmiaWoodsForm,
		() => {
			checkError();
		},
		{ deep: true },
	);

	function checkError() {
		if (!props.required) {
			return;
		}

		const { value } = model;
		const isValid = value && String(value).length > 0;
		error.value = !isValid;
		errorMessage.value = 'This field is required.';

		if (error.value && input.value) {
			input.value.focus();
		}
	}
</script>

<template>
	<div class="form-control w-full">
		<label
			:for="$attrs.id"
			class="label"
		>
			<span class="label-text">{{ label }}</span>
			<span
				v-if="labelAlt"
				class="label-text-alt"
				>{{ labelAlt }}</span
			>
		</label>
		<select
			ref="input"
			v-bind="$attrs"
			v-model="model"
			class="select select-bordered w-full"
			:class="[
				{
					'select-error': error,
					required: required,
				},
			]"
			:disabled="disabled"
		>
			<option
				v-if="optionDescription"
				disabled
				value=""
			>
				{{ optionDescription }}
			</option>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
			>
				{{ option.name }}
			</option>
		</select>

		<!-- <font-awesome-icon v-if="disabled" class="absolute right-[12px] top-[13px] text-sm text-zinc-500" icon="lock" /> -->
		<label
			v-if="bottomLabelLeft || bottomLabelRight"
			:for="$attrs.id"
			class="label"
		>
			<span
				v-if="bottomLabelLeft"
				class="label-text-alt"
				>{{ bottomLabelLeft }}</span
			>
			<span
				v-if="bottomLabelRight"
				class="label-text-alt"
				>{{ bottomLabelRight }}</span
			>
		</label>

		<div
			v-if="error"
			class="mt-2 text-sm font-normal text-red-600"
		>
			{{ errorMessage }}
		</div>
	</div>
</template>
