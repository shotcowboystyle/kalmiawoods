<script setup lang="ts">
	import type { User } from '@/types/User';
	import { phoneFormatUSA } from '@/utils/phone';

	interface Props {
		users: User[];
		handleDeleteUser: (userId: string) => void;
	}

	defineProps<Props>();
</script>

<template>
	<div class="overflow-x-auto shadow">
		<table class="table">
			<thead class="bg-gray-100 dark:bg-gray-700">
				<tr>
					<th
						scope="col"
						class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
					>
						Name
					</th>
					<td class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
						Address
					</td>
					<td class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
						Mobile Phone
					</td>
					<td class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
						Role
					</td>
					<td class="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
						Actions
					</td>
				</tr>
			</thead>

			<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
				<tr
					v-for="user in users"
					:key="user?.userId"
					:data="user"
					class="hover"
				>
					<td class="mr-4 flex items-center space-x-3 whitespace-nowrap p-4">
						<div class="avatar">
							<div class="mask mask-squircle h-12 w-12">
								<img
									src="https://placebeard.it/56/56"
									:alt="user?.firstName"
								/>
							</div>
						</div>
						<div>
							<div class="font-bold">{{ user.firstName }} {{ user.lastName }}</div>
							<div class="text-sm opacity-50">{{ user.email }}</div>
						</div>
					</td>

					<td
						class="mr-4 max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs"
					>
						<span v-html="user.address?.replace(/,/, '<br />')"></span>
					</td>

					<td class="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
						<a
							:href="`tel:+1${user.mobilePhone}`"
							class="link"
						>
							{{ phoneFormatUSA(user.mobilePhone) }}
						</a>
					</td>

					<td class="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
						{{ user?.role }}
					</td>

					<td class="w-36 space-x-2 whitespace-nowrap p-4">
						<a
							:href="`/admin/users/${user.userId}`"
							class="btn"
						>
							<svg
								class="h-4 w-4"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
								/>
								<path
									fill-rule="evenodd"
									d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="sr-only">Edit</span>
						</a>
						<button
							type="button"
							class="btn btn-error"
							@click="handleDeleteUser(user!.userId)"
						>
							<svg
								class="h-4 w-4"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="sr-only">Delete</span>
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
