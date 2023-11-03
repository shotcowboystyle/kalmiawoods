<script setup lang="ts">
	import type { CheckboxGroupOptionsType } from '@/types/common';
	import { useVModel } from '@vueuse/core';

	defineOptions({ inheritAttrs: false });
	const props = defineProps<{
		label: string;
		required?: boolean;
		rules?: string[];
		disabled?: boolean;
		modelValue: string[];
		options: CheckboxGroupOptionsType[];
		validationMatch?: string;
		validationMatchers?: string[];
		errorMessagePrefix?: string;
	}>();

	const model = useVModel(props, 'modelValue');
	const error = ref(false);
	const errorMessage = ref<string | undefined>();
	const formValidator = useFormValidator();
	const kalmiaWoodsForm = inject('kalmiaWoodsForm', undefined);
	const input = ref(null);

	watch(
		() => kalmiaWoodsForm,
		() => {
			checkError();
		},
		{ deep: true },
	);

	function checkError() {
		if (!props.required && !props.rules?.length) {
			return;
		}

		const validated = formValidator.validate(
			model.value,
			formValidator.allRules(props.required, props.rules ?? []),
			{
				match: props.validationMatch,
				matchers: props.validationMatchers,
				errorMessagePrefix: props.errorMessagePrefix,
			},
		);
		error.value = !validated.isValid;
		errorMessage.value = validated.errorMessage;
	}

	function handleSelectAll() {
		model.value = props.options.map((option) => option.value);
	}
</script>

<template>
	<fieldset :class="['checkbox-group', $attrs.class]">
		<legend class="checkbox-group-legend">
			<span
				:class="[
					'label-text',
					{
						required: required,
					},
				]"
			>
				{{ label }}
			</span>
			<button
				type="button"
				class="btn btn-link label-text-alt"
				@click="handleSelectAll"
			>
				Select all
			</button>
		</legend>

		<div
			v-for="option in options"
			:key="option.value"
			class="checkbox-tile-wrapper"
		>
			<label
				class="checkbox-wrapper"
				:for="option.value"
			>
				<!-- @input="checkError" -->
				<input
					v-bind="$attrs"
					:id="option.value"
					ref="input"
					v-model="model"
					type="checkbox"
					:class="['checkbox-input', { 'checkbox-error': error }]"
					:name="option.value"
					:value="option.value"
				/>
				<span class="checkbox-tile">
					<span class="checkbox-icon">
						<SvgSpriteVue :name="option.icon" />
					</span>
					<span class="checkbox-label">{{ option.name }}</span>
				</span>
			</label>
		</div>

		<div
			v-if="error"
			class="mt-2 text-sm font-normal text-red-600"
		>
			{{ errorMessage }}
		</div>
	</fieldset>
</template>

<style lang="postcss">
	.checkbox-group {
		@apply mx-auto flex select-none flex-wrap justify-center;

		& > * {
			margin: 0.5rem 0.5rem;
		}
	}

	.checkbox-group-legend {
		@apply mb-0 text-base font-bold text-neutral-content;
	}

	.checkbox-input {
		@apply absolute h-px w-px overflow-hidden whitespace-nowrap;

		clip: rect(0 0 0 0);
		clip-path: inset(100%);

		&:checked + .checkbox-tile {
			@apply border-primary text-primary;

			box-shadow: 0 5px 10px rgba(rgb(0, 0, 0), 0.1);

			&:before {
				@apply border-primary bg-primary opacity-100;

				transform: scale(1);
			}

			.checkbox-icon,
			.checkbox-label {
				@apply text-primary;
			}
		}

		&:focus + .checkbox-tile {
			@apply border-primary;

			box-shadow:
				0 5px 10px rgba(rgb(0, 0, 0), 0.1),
				0 0 0 4px rgb(181, 252, 208);

			&:before {
				transform: scale(1);
				opacity: 1;
			}
		}
	}

	.checkbox-tile {
		@apply relative flex cursor-pointer flex-col items-center justify-center rounded-lg bg-white;

		width: 6rem;
		min-height: 6rem;
		border: 2px solid rgb(181, 252, 208);
		box-shadow: 0 5px 10px rgba(rgb(0, 0, 0), 0.1);
		transition: 0.15s ease;

		&:before {
			@apply absolute left-1 top-1 block h-5 w-5 rounded-full bg-white opacity-0;

			content: '';
			border: 2px solid rgb(181, 252, 208);
			transform: scale(0);
			transition: 0.25s ease;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' fill='%23FFFFFF' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='none'%3E%3C/rect%3E%3Cpolyline points='216 72.005 104 184 48 128.005' fill='none' stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'%3E%3C/polyline%3E%3C/svg%3E");
			background-size: 12px;
			background-repeat: no-repeat;
			background-position: 50% 50%;
		}

		&:hover {
			@apply border-primary;

			&:before {
				@apply opacity-100;

				transform: scale(1);
			}
		}
	}

	.checkbox-icon {
		transition: 0.375s ease;
		color: rgb(73, 73, 73);

		svg {
			@apply h-10 w-10;
		}
	}

	.checkbox-label {
		@apply mb-0 text-center text-sm text-neutral-content;

		transition: 0.375s ease;
	}
</style>
