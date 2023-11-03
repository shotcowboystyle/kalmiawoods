<script setup lang="ts">
	import PictureUploader from '@/components/PictureUploader.vue';
	import FormUserEmail from '@/modules/Profile/FormUserEmail.vue';
	import FormUserPassword from '@/modules/Profile/FormUserPassword.vue';
	import FormUserProfile from '@/modules/Profile/FormUserProfile.vue';
	import { $user, setActiveUserId } from '@/stores/user';

	interface Props {
		isProfile?: boolean;
		mode: string;
	}

	const props = withDefaults(defineProps<Props>(), { isProfile: false, mode: 'latest' });

	setActiveUserId(props.mode);
</script>

<template>
	<div class="grid grid-cols-1 dark:bg-gray-900 xl:grid-cols-3 xl:gap-4">
		<div class="col-span-full xl:col-auto">
			<div
				class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
			>
				<div class="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
					<PictureUploader title="Profile picture" />
				</div>
			</div>
		</div>

		<div class="col-span-2">
			<div
				class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
			>
				<h3 class="mb-4 text-xl font-semibold dark:text-white">General information</h3>
				<span
					v-if="!$user.userId"
					class="loading loading-spinner loading-lg"
				></span>
				<FormUserProfile v-else />
			</div>

			<div
				class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
			>
				<h3 class="mb-4 text-xl font-semibold dark:text-white">Password information</h3>
				<span
					v-if="!$user.userId"
					class="loading loading-spinner loading-lg"
				></span>
				<FormUserPassword v-else />
			</div>

			<div
				class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
			>
				<h3 class="mb-4 text-xl font-semibold dark:text-white">Change email</h3>
				<span
					v-if="!$user.userId"
					class="loading loading-spinner loading-lg"
				></span>
				<FormUserEmail v-else />
			</div>
		</div>
	</div>
</template>
