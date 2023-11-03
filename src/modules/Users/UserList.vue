<script setup lang="ts">
	import {
		$isDeleteUserModalOpen,
		$isUserModalOpen,
		$users,
		fetchNewUsers,
		toggleDeleteUserModal,
	} from '@/stores/user';
	import { phoneFormatUSA } from '@/utils/phone';
	import FormDeleteUser from './FormDeleteUser.vue';
	import FormUser from './FormUser.vue';
	import UserListCard from './UserListCard.vue';
	import UserListTable from './UserListTable.vue';

	const bodyEl = ref();
	const { arrivedState } = useScroll(bodyEl);

	const deleteUserId = ref('');

	const onDeleteUser = (userId: string) => {
		deleteUserId.value = userId;
		toggleDeleteUserModal();
	};

	watch(arrivedState, ({ bottom }) => {
		if (bottom) {
			fetchNewUsers();
		}
	});
</script>

<template>
	<div class="flex-1 px-2 sm:px-0">
		<div class="hidden sm:flex sm:items-center sm:justify-between">
			<h3 class="text-3xl font-extralight text-white/50">Groups</h3>
			<div class="inline-flex items-center space-x-2">
				<a
					class="smooth-hover rounded-md bg-gray-900 p-2 text-white/50 hover:text-white"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/>
					</svg>
				</a>

				<a
					class="smooth-hover rounded-md bg-gray-900 p-2 text-white/50 hover:text-white"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 10h16M4 14h16M4 18h16"
						/>
					</svg>
				</a>
			</div>
		</div>

		<div
			class="mb-10 mt-10 grid grid-cols-1 gap-4 sm:mb-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
		>
			<div
				class="hover:smooth-hover group flex cursor-pointer flex-col items-center space-y-2 rounded-2xl bg-white/30 px-4 py-20 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:hover:bg-gray-900/40"
			>
				<a
					class="group-hover:smooth-hover flex h-20 w-20 items-center justify-center rounded-full bg-gray-900/70 text-white/50 group-hover:text-white"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-10 w-10"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
				</a>
				<a
					class="group-hover:smooth-hover text-center text-white/50 group-hover:text-white"
					href="#"
					>Create group</a
				>
			</div>

			<Fragment
				v-for="user in $users"
				:key="user?.userId"
			>
				<UserListCard
					v-if="user"
					:user="user"
					:handle-delete-user="onDeleteUser"
				/>
			</Fragment>
		</div>
	</div>

	<dialog
		class="modal modal-bottom sm:modal-middle"
		:open="$isUserModalOpen"
	>
		<div
			v-if="$isUserModalOpen"
			class="modal-box"
		>
			<h3 class="text-lg font-bold">User details</h3>
			<FormUser class="py-4" />
		</div>
	</dialog>

	<dialog
		class="modal modal-bottom sm:modal-middle"
		:open="$isDeleteUserModalOpen"
	>
		<div
			v-if="$isDeleteUserModalOpen"
			class="modal-box"
		>
			<h3 class="text-lg font-bold">Delete user</h3>
			<FormDeleteUser :user-id="deleteUserId" />
		</div>
	</dialog>
</template>
