<script setup lang="ts">
	import { $allUserEmails, $allUserMobilePhones, addUser, toggleUserModal } from '@/stores/user';
	import type { CreateUserInput } from '@/types/User';
	import { fetchPost } from '@/utils/fetchClient';
	import { formatPhoneInputUSA } from '@/utils/phone';
	import { useToast } from 'vue-toastification';

	const emit = defineEmits(['input-mobile-phone']);

	const toast = useToast();

	const isSubmitting = ref(false);
	const formData = reactive<CreateUserInput>({
		email: '',
		firstName: '',
		lastName: '',
		mobilePhone: '',
		address: '',
	});

	const maskPhone = (event: Event) => {
		const { value } = event.target as HTMLInputElement;
		formData.mobilePhone = formatPhoneInputUSA(value);
		emit('input-mobile-phone', formData.mobilePhone);
	};

	async function submit() {
		isSubmitting.value = true;

		try {
			const response = await fetchPost('admin/users', formData);
			const data = await response.json();
			addUser(data);
			toggleUserModal();
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			isSubmitting.value = false;
		}
	}
</script>

<template>
	<KwForm @submit="submit">
		<div class="mb-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-6 sm:gap-y-0">
			<KwTextField
				id="firstName"
				v-model="formData.firstName"
				type="text"
				class="form-control w-full"
				label="First name"
				name="firstName"
				placeholder="enter user's first name"
				required
			/>

			<KwTextField
				id="lastName"
				v-model="formData.lastName"
				type="text"
				class="form-control w-full"
				label="Last name"
				name="lastName"
				placeholder="enter user's last name"
				required
			/>
		</div>

		<KwTextField
			id="email"
			v-model="formData.email"
			class="form-control mb-4 w-full"
			label="Email"
			name="email"
			required
			:rules="['email', 'isUnique']"
			:validation-matchers="$allUserEmails"
			error-message-prefix="Email"
			type="email"
			placeholder="enter user's email"
			autocomplete="off"
		/>

		<KwTextField
			id="mobilePhone"
			v-model="formData.mobilePhone"
			class="form-control mb-4 w-full"
			label="Mobile phone"
			name="mobilePhone"
			placeholder="enter user's mobile phone"
			autocomplete="off"
			required
			:rules="['phone', 'isUnique']"
			:validation-matchers="$allUserMobilePhones"
			type="tel"
			@input="maskPhone"
		/>

		<KwTextField
			id="address"
			v-model="formData.address"
			type="text"
			class="form-control mb-4 w-full"
			label="Address"
			name="address"
			placeholder="enter user's address"
		/>

		<div class="mt-8 flex justify-end gap-6">
			<button
				type="button"
				class="btn btn-ghost"
				@click="toggleUserModal"
			>
				Cancel
			</button>
			<KwButton
				variant="primary"
				text="Create User"
				icon-right="arrow-right"
				type="submit"
				:disabled="isSubmitting"
				:loading="isSubmitting"
			/>
		</div>
	</KwForm>
</template>
