<script setup lang="ts">
	import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
	import { DatePicker } from 'v-calendar';
	import 'v-calendar/dist/style.css';
	import { UNEXPECTED_SERVER_ERROR_MESSAGE } from '@/app/constants';
	import { $colorScheme } from '@/stores/color-scheme';
	import {
		$disabledReservationDates,
		$reservation,
		addReservation,
		removeReservation,
		toggleReservationModal,
	} from '@/stores/reservation';
	import { $users } from '@/stores/user';
	import { fetchDelete, fetchPost, fetchPut } from '@/utils/fetchClient';
	import { useToast } from 'vue-toastification';

	export interface Props {
		isAdmin?: boolean;
		authUserId: string;
		isEditingReservation?: boolean;
		selectedDate?: string;
	}

	const props = withDefaults(defineProps<Props>(), {
		isAdmin: false,
		isEditingReservation: false,
		selectedDate: undefined,
	});

	const toast = useToast();

	const breakpoints = useBreakpoints(breakpointsTailwind);
	const smAndLarger = breakpoints.greater('sm');

	const buildingsOptions = [
		{
			icon: 'home-icon',
			name: 'Main House',
			value: 'HOUSE',
		},
		{
			icon: 'warehouse-icon',
			name: 'Garage',
			value: 'GARAGE',
		},
		{
			icon: 'workshop-icon',
			name: 'Workshop',
			value: 'WORKSHOP',
		},
	];

	const selectUserOptions = computed(() => [
		...Object.values($users.value).map((u) => {
			return {
				value: u?.userId,
				name: `${u?.firstName} ${u?.lastName}`,
			};
		}),
	]);

	const submitButtonText = props.isEditingReservation ? 'Update' : 'Create';
	const isSubmitting = ref(false);
	const formData = reactive({
		reservationId: props.isEditingReservation ? $reservation.value.reservationId : null,
		userId:
			props.isEditingReservation && $reservation.value.userId
				? $reservation.value.userId
				: props.isAdmin
				? ''
				: props.authUserId,
		title:
			props.isEditingReservation && $reservation.value.title ? $reservation.value.title : undefined,
		buildings:
			props.isEditingReservation && $reservation.value.buildings
				? $reservation.value.buildings
				: ['HOUSE'],
		range: {
			start: props.isEditingReservation ? $reservation.value.checkInDate : props.selectedDate,
			end: props.isEditingReservation ? $reservation.value.checkOutDate : props.selectedDate,
		},
	});

	const popover = ref({
		visibility: 'click',
	});

	async function submit() {
		isSubmitting.value = true;

		try {
			const response = props.isEditingReservation
				? await fetchPut(`reservations/${$reservation.value.reservationId}`, formData)
				: await fetchPost('reservations', formData);
			const data = await response.json();
			addReservation(data);
			toggleReservationModal();
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			isSubmitting.value = false;
		}
	}

	const isDeleting = ref(false);
	async function deleteReservation(reservationId: string) {
		isDeleting.value = true;

		try {
			const response = await fetchDelete(`reservations/${reservationId}`);
			if (response.status === 200) {
				removeReservation(reservationId);
				toggleReservationModal();
			} else {
				toast.error(UNEXPECTED_SERVER_ERROR_MESSAGE);
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}

			console.log('Unexpected Error', UNEXPECTED_SERVER_ERROR_MESSAGE);
		} finally {
			isDeleting.value = false;
		}
	}
</script>

<template>
	<KwForm @submit="submit">
		<div
			v-if="isAdmin"
			class="form-control mb-6 w-full"
		>
			<KwSelectField
				id="userId"
				v-model="formData.userId"
				label="Main Guest"
				name="userId"
				option-description="Select user to link reservation to"
				:options="selectUserOptions"
				required
			/>
		</div>

		<KwTextField
			id="title"
			v-model="formData.title"
			type="text"
			class="form-control mb-4 w-full"
			label="Title"
			name="title"
			bottom-label-left="ie., Marge and the kids"
		/>

		<DatePicker
			v-model.range="formData.range"
			:class="{ 'border-0': smAndLarger }"
			color="green"
			:columns="smAndLarger ? 2 : 1"
			:min-date="new Date()"
			range
			:is-dark="$colorScheme === 'dark'"
			:popover="popover"
			:is-expanded="smAndLarger"
			:trim-weeks="!smAndLarger"
			:disabled-dates="$disabledReservationDates"
		>
			<template #default="{ inputValue, inputEvents }">
				<div class="flex items-center justify-center">
					<div class="mb-4 grid h-full flex-grow grid-cols-[1fr,1fr] items-center gap-8 px-0">
						<KwTextField
							id="checkInDate"
							type="text"
							class="form-control w-full"
							label="Check in"
							name="checkInDate"
							placeholder="Select date"
							:value="inputValue.start"
							required
							v-on="inputEvents.start"
						/>

						<KwTextField
							id="checkOutDate"
							type="text"
							class="form-control w-full"
							label="Check out"
							name="checkOutDate"
							placeholder="Select date"
							:value="inputValue.end"
							required
							v-on="inputEvents.end"
						/>
					</div>
				</div>
			</template>
		</DatePicker>

		<KwCheckboxGroup
			v-model="formData.buildings"
			class="mb-4"
			label="Locations"
			:options="buildingsOptions"
			required
		/>

		<div class="mt-16 flex justify-evenly">
			<KwButton
				v-if="$reservation.reservationId"
				variant="danger"
				text="Delete"
				icon-left="arrow-left"
				:disabled="isDeleting"
				:loading="isDeleting"
				@click="deleteReservation($reservation.reservationId)"
			/>

			<div class="flex grow justify-end gap-4">
				<button
					type="button"
					class="btn btn-ghost md:flex"
					@click="toggleReservationModal()"
				>
					Cancel
				</button>
				<KwButton
					variant="primary"
					:text="submitButtonText"
					type="submit"
					:disabled="isSubmitting"
					:loading="isSubmitting"
				/>
			</div>
		</div>
	</KwForm>
</template>

<style>
	.vc-day {
		@apply p-1.5;
	}

	.vc-day-content {
		@apply text-xs;
	}

	.vc-highlight {
		@apply h-8 w-8;
	}
</style>
