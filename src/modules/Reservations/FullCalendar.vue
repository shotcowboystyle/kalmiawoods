<script setup lang="ts">
	import { $authUser } from '@/stores/auth';
	import { $colorScheme } from '@/stores/color-scheme';
	import {
		$disabledReservationDates,
		$isReservationModalOpen,
		$reservations,
		setActiveReservationId,
		toggleReservationModal,
	} from '@/stores/reservation';
	import type { CalendarDay } from '@/types/FullCalendar';
	import { dateInPast } from '@/utils/date';
	import { capitalize } from '@/utils/string';
	import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
	import { Calendar } from 'v-calendar';
	import FormReservation from './FormReservation.vue';

	const breakpoints = useBreakpoints(breakpointsTailwind);
	const mdAndLarger = breakpoints.greaterOrEqual('md');

	const isEditingReservation = ref(false);

	const calendar = ref(null);

	const attrs = computed(() => [
		...Object.entries($reservations.value).map(([key, val]) => {
			return {
				key,
				popover: {
					label: `${val?.user.firstName} ${val?.user.lastName}`,
					isInteractive: true,
				},
				customData: val,
				dates: {
					start: val && val.checkInDate,
					end: val && val.checkOutDate,
				},
			};
		}),
	]);

	const masks = ref({
		weekdays: 'WWW',
	});

	const selectedReservationDate = ref<Date | undefined>();
	const onDayClick = (day: CalendarDay, reservationId = null, userId = null) => {
		if (dateInPast(day.date)) {
			return;
		}

		if (
			reservationId &&
			($authUser.value.isAdmin || (userId && userId === $authUser.value.userId))
		) {
			setActiveReservationId(reservationId);
			isEditingReservation.value = true;
		} else {
			setActiveReservationId(null);
			selectedReservationDate.value = day.date;
			isEditingReservation.value = false;
		}

		if (
			!reservationId ||
			(reservationId && ($authUser.value.isAdmin || (userId && userId === $authUser.value.userId)))
		) {
			toggleReservationModal();
		}
	};
</script>

<template>
	<Calendar
		ref="calendar"
		class="calendar shadow-xl"
		:class="{ 'custom-calendar': mdAndLarger }"
		:masks="masks"
		:attributes="attrs"
		:min-date="new Date()"
		:disabled-dates="$disabledReservationDates"
		disable-page-swipe
		expanded
		trim-weeks
		:is-dark="$colorScheme === 'dark'"
		title-position="left"
		:rows="mdAndLarger ? 1 : 6"
		:step="1"
	>
		<template #title="{ monthLabel, yearLabel }">
			<div
				class="vc-header is-lg self-center text-lg text-base-content"
				style="grid-template-columns: [title] auto 1fr [prev] auto [next] auto"
			>
				<button
					type="button"
					class="vc-title"
				>
					<span class="font-extrabold">{{ monthLabel }}</span>
					<span class="ml-2 font-thin text-slate-900">{{ yearLabel }}</span>
				</button>
			</div>
		</template>
		<template #day-content="{ day, attributes }">
			<div
				class="flex h-full cursor-pointer flex-col md:min-h-16 md:w-full"
				:class="[
					{
						'is-disabled':
							!$authUser.isAdmin &&
							attributes?.[0]?.customData?.userId !== $authUser.userId &&
							day.isDisabled,
					},
					{ 'is-reserved': day.isDisabled },
				]"
				:aria-disabled="day.isDisabled"
				@click="onDayClick(day, attributes?.[0]?.key, attributes?.[0]?.customData?.userId)"
			>
				<span class="day-label text-gray-90 0 self-center py-4 text-sm md:p-4 md:leading-4">
					{{ day.day }}
				</span>
				<div class="day-events">
					<div
						v-if="attributes?.[0]"
						:key="attributes?.[0]?.key"
						class="day-event"
						:class="[
							{
								'day-event-secondary':
									day.date.toString() !== attributes?.[0]?.targetDate?.start.toString(),
							},
							{
								'day-event-end':
									day.date.toString() === attributes?.[0]?.targetDate?.end.toString(),
							},
							{
								'day-event-has-secondary':
									day.date.toString() === attributes?.[0]?.targetDate?.start.toString() &&
									attributes?.[0]?.targetDate?.isRange &&
									attributes?.[0]?.targetDate?.start.toString() !==
										attributes?.[0]?.targetDate?.end.toString(),
							},
							{ 'is-user-event': attributes?.[0]?.customData?.userId === $authUser.userId },
						]"
					>
						<div class="hidden md:inline">
							<p class="truncate font-bold">
								<span
									v-if="
										($authUser.isAdmin ||
											$authUser.userId === attributes?.[0]?.customData?.userId) &&
										attributes?.[0]?.customData?.title?.length
									"
								>
									{{ attributes?.[0]?.customData?.title }}
								</span>
								<span
									v-else-if="
										$authUser.isAdmin || $authUser.userId === attributes?.[0]?.customData?.userId
									"
								>
									{{ attributes?.[0]?.customData?.user?.firstName }}
									{{ attributes?.[0]?.customData?.user?.lastName }}
								</span>
								<span v-else>Reserved</span>
							</p>
							<p v-if="attributes?.[0]?.customData?.buildings?.length > 0">
								<span v-if="attributes?.[0]?.customData?.buildings?.length === 3">
									All locations
								</span>
								<span v-else>
									<template
										v-for="(building, idx) in attributes?.[0]?.customData?.buildings"
										:key="building"
									>
										<span v-if="idx === 1"> and </span>
										<span>{{ capitalize(building) }}</span>
									</template>
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</template>
	</Calendar>

	<dialog
		class="modal modal-bottom sm:modal-middle"
		:open="$isReservationModalOpen"
	>
		<div
			v-if="$isReservationModalOpen"
			class="modal-box"
		>
			<h3 class="text-lg font-bold">Reservation details</h3>
			<FormReservation
				class="mt-4"
				:selected-date="selectedReservationDate"
				:is-admin="$authUser.isAdmin"
				:auth-user-id="$authUser.userId"
				:is-editing-reservation="isEditingReservation"
			/>
		</div>
	</dialog>
</template>

<style>
	@import 'v-calendar/dist/style.css';

	.calendar.vc-container {
		border-radius: 0;

		.vc-header {
			@apply mb-2.5;
		}

		.vc-header .vc-arrows-container {
			@apply btn-group;

			& .vc-arrow {
				@apply btn btn-ghost btn-sm rounded-none;

				& svg {
					@apply h-5 w-5;
				}
			}
		}

		.vc-weeks {
			@apply border-t border-neutral-200 p-0 dark:border-neutral-700;
		}

		.vc-weekday {
			@apply self-center;

			&:not(:last-child) {
				@apply border-r border-neutral-200 dark:border-neutral-700;
			}
		}

		.vc-day {
			@apply border-b border-neutral-200 p-0 hover:bg-neutral-50 focus:bg-neutral-50 dark:border-neutral-700 hover:dark:bg-slate-800 focus:dark:bg-slate-800 md:w-max;

			&.on-top {
				@apply border-t;
			}

			&:not(.on-right) {
				@apply border-r;
			}
		}

		.day-events {
			@apply flex-grow;
		}

		.day-event {
			@apply bg-primary p-1;

			&.is-user-event {
				@apply bg-info;
			}
		}

		.vc-day .is-reserved {
			@apply rounded-none bg-neutral-200 hover:bg-neutral-200 focus:bg-neutral-200 dark:bg-slate-800 hover:dark:bg-slate-800 focus:dark:bg-slate-800;

			.day-label {
				@apply dark:text-slate-500;
			}
		}

		.vc-day .is-disabled {
			@apply cursor-not-allowed;
		}
	}

	.custom-calendar.vc-container {
		width: max-content;

		& .vc-popover-content {
			max-height: 300px;
			overflow: hidden;
			overflow-y: auto;
		}

		& .vc-day-popover-row-content {
			max-width: 250px;
			flex-direction: column;
			padding: 8px;
			border: 1px solid #3082ce;
			border-radius: 5px;
			margin-bottom: 10px;
		}

		& .vc-weekday {
			@apply p-2;
		}

		& .vc-day {
			@apply relative flex w-full flex-col items-start justify-start md:h-40 md:min-w-full;

			& .vc-day-content {
				@apply relative h-full w-full items-start justify-start border-0 p-4 text-sm leading-4 hover:rounded-none focus:rounded-none;
			}

			& .vc-highlights .vc-day-layer {
				@apply top-2 items-start justify-start;
			}

			& .vc-highlights .vc-day-layer .vc-highlight:not(.vc-highlight-base-start) {
				@apply ml-3;
			}

			& .vc-highlights .vc-day-layer .vc-highlight.vc-highlight-base-start {
				@apply ml-5 !w-full;
			}
		}

		& .day-events {
			@apply overflow-visible;
		}

		& .day-event {
			@apply mx-6 mb-1 mt-0 rounded-sm p-2 text-sm text-primary-content;
		}

		& .day-event-end {
			@apply !ml-0 !w-11/12 !rounded-none !rounded-r-sm;
		}

		& .day-event-has-secondary {
			@apply !mr-0 rounded-none rounded-s-sm;
		}

		& .day-event-secondary {
			@apply !mx-0 !-ml-1 rounded-none;

			& p {
				@apply invisible;
			}
		}

		& .vc-day-dots {
			margin-bottom: 5px;
		}
	}
</style>
