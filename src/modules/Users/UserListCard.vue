<script setup lang="ts">
	import { $authUser } from '@/stores/auth';
	import type { User } from '@/types/User';

	interface Props {
		user: User;
		handleDeleteUser: (userId: string) => void;
	}

	defineProps<Props>();
</script>

<template>
	<div
		class="group max-w-sm rounded-2xl bg-white px-1 pb-8 pt-2 text-right shadow-md dark:bg-gray-900"
	>
		<details
			v-if="$authUser.isAdmin"
			class="dropdown"
		>
			<summary
				id="dropdown-button"
				class="btn btn-ghost"
			>
				<svg
					class="h-6 w-6"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
					></path>
				</svg>
			</summary>

			<ul
				class="menu dropdown-content rounded-box z-[1] w-52 bg-white p-2 shadow dark:bg-gray-900"
				aria-labelledby="dropdown-button"
			>
				<li>
					<a
						href="#"
						class="link-error link"
						@click="handleDeleteUser(user.userId)"
					>
						Delete
					</a>
				</li>
			</ul>
		</details>

		<div class="flex flex-col items-center">
			<div class="avatar">
				<div class="w-24 rounded-full">
					<img
						src="https://placebeard.it/56/56"
						:alt="`avatar for ${user.firstName} ${user.lastName}`"
					/>
				</div>
			</div>

			<h3 class="mb-1 mt-4 text-xl font-medium text-gray-900 dark:text-white">
				{{ user.firstName }} {{ user?.lastName }}
			</h3>
			<span class="text-sm text-gray-500 dark:text-gray-400">{{ user.role }}</span>
			<div class="mt-4 flex space-x-3 lg:mt-6">
				<a
					:href="`tel:${user.mobilePhone}`"
					class="btn btn-primary"
				>
					Call
				</a>
				<a
					:href="`mailto:${user.email}`"
					class="btn btn-primary"
				>
					Email
				</a>
				<a
					:href="`/admin/users/${user.userId}`"
					class="btn"
				>
					Details
				</a>
			</div>
		</div>
	</div>
</template>
