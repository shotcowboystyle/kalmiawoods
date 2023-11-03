<script setup lang="ts">
	import { breakpointsTailwind, useBreakpoints, useVModel } from '@vueuse/core';
	import { DatePicker } from 'v-calendar';
	import 'v-calendar/dist/style.css';
	import { $colorScheme } from '@/stores/color-scheme';
	import { $disabledReservationDates } from '@/stores/reservation';

	defineOptions({ inheritAttrs: false });
	const props = defineProps<{
		label: string;
		labelAlt?: string;
		bottomLabelLeft?: string;
		bottomLabelRight?: string;
		required: boolean;
		rules?: string[];
		disabled?: boolean;
		modelValue: string;
		validationMatch?: string;
		validationMatchers?: string[];
		errorMessagePrefix?: string;
	}>();

	const model = useVModel(props, 'modelValue');
	const error = ref(false);
	const errorMessage = ref<string | undefined>();
	const formValidator = useFormValidator();
	const kalmiaWoodsForm = inject('kalmiaWoodsForm', undefined);
	const input = ref<HTMLInputElement | null>(null);

	const breakpoints = useBreakpoints(breakpointsTailwind);
	const smAndLarger = breakpoints.greater('sm');

	const popover = ref({
		visibility: 'click',
	});

	watch(
		() => kalmiaWoodsForm,
		() => {
			checkError();
		},
		{ deep: true },
	);

	function checkError() {
		if (!props.rules || (!props.required && !props.rules?.length)) {
			return;
		}

		const validated = formValidator.validate(
			model.value,
			formValidator.allRules(props.required, props.rules),
			{
				match: props.validationMatch,
				matchers: props.validationMatchers,
				errorMessagePrefix: props.errorMessagePrefix,
			},
		);
		error.value = !validated.isValid;
		errorMessage.value = validated.errorMessage;

		if (error.value && input.value) {
			input.value.focus();
		}
	}
</script>

<template>
	<div :class="$attrs.class">
		<DatePicker
			v-model.range="formData.range"
			:class="{ 'border-0': smAndLarger }"
			color="green"
			:columns="smAndLarger ? 2 : 1"
			:min-date="new Date()"
			range
			is-required
			:is-dark="$colorScheme === 'dark'"
			:popover="popover"
			:is-expanded="smAndLarger"
			:trim-weeks="!smAndLarger"
			:disabled-dates="$disabledReservationDates"
		>
			<template #default="{ inputValue, inputEvents }">
				<div class="flex items-center justify-center">
					<div class="mb-4 grid h-full flex-grow grid-cols-[1fr,1fr] items-center gap-8 px-0">
						<div class="form-control w-full">
							<label
								for="checkInDate"
								class="label"
							>
								<span class="label-text">Check in</span>
							</label>
							<input
								id="checkInDate"
								type="text"
								name="checkInDate"
								placeholder="Select date"
								:value="inputValue.start"
								class="input input-bordered w-full"
								v-on="inputEvents.start"
							/>
						</div>

						<div class="form-control w-full">
							<label
								for="checkOutDate"
								class="label"
							>
								<span class="label-text">Check out</span>
							</label>
							<input
								id="checkOutDate"
								type="text"
								name="checkOutDate"
								placeholder="Select date"
								:value="inputValue.end"
								class="input input-bordered w-full"
								v-on="inputEvents.end"
							/>
						</div>
					</div>
				</div>
			</template>
		</DatePicker>

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

		<input
			ref="input"
			v-bind="$attrs"
			v-model="model"
			class="input input-bordered w-full max-w-xs"
			:class="{
				'input-error': error,
			}"
			:disabled="disabled"
			@input="checkError"
		/>

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
