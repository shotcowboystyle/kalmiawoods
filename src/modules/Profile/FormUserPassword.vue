<script setup lang="ts">
	import { $activeUser, $activeUserId, updateUser } from '@/stores/user';
	import { fetchPost, fetchPut } from '@/utils/fetchClient';
	import { useToast } from 'vue-toastification';

	const toast = useToast();

	const hidePassword = ref(true);
	const showPasswordMeter = ref(false);
	const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
	const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));
	const currentPasswordErrorMessage = ref('');

	const isSubmitting = ref(false);
	const initFormData = {
		currentPassword: undefined,
		newPassword: undefined,
		confirmNewPassword: undefined,
	};
	const formData = reactive({ ...initFormData });

	async function submit() {
		currentPasswordErrorMessage.value = '';
		isSubmitting.value = true;

		try {
			await fetchPost(`admin/users/${$activeUserId.value}/verify-password`, {
				email: $activeUser.value.email,
				currentPassword: formData.currentPassword,
			});
		} catch {
			currentPasswordErrorMessage.value = 'Your current password is incorrect.';
			return;
		} finally {
			isSubmitting.value = false;
		}

		try {
			const updatePasswordResponse = await fetchPut(`admin/users/${$activeUserId.value}/password`, {
				newPassword: formData.newPassword,
			});

			const data = await updatePasswordResponse.json();
			updateUser(data);
			toast.success('Update successful.');
			Object.assign(formData, initFormData);
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			isSubmitting.value = false;
		}
	}
</script>

<template>
	<KwForm @submit="submit">
		<KwTextField
			id="currentPassword"
			v-model="formData.currentPassword"
			class="form-control mb-4 w-full md:w-1/2 md:pr-4"
			label="Current password"
			name="currentPassword"
			required
			:type="passwordFieldType"
			:set-invalid-class="currentPasswordErrorMessage?.length > 0"
			autocomplete="off"
		/>
		<div
			v-if="currentPasswordErrorMessage.length"
			class="-mt-2 mb-2 text-sm font-normal text-red-600"
		>
			{{ currentPasswordErrorMessage }}
		</div>

		<div class="mb-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-6 sm:gap-y-0">
			<div class="relative w-full">
				<KwTextField
					id="newPassword"
					v-model="formData.newPassword"
					class="form-control w-full"
					label="New password"
					name="newPassword"
					required
					:rules="['password']"
					:type="passwordFieldType"
					autocomplete="off"
					@focus="showPasswordMeter = !showPasswordMeter"
					@blur="showPasswordMeter = !showPasswordMeter"
				/>
				<div class="absolute right-2.5 top-11">
					<button
						type="button"
						class="btn btn-ghost btn-sm"
						@click="togglePasswordVisibility"
					>
						<span v-if="!hidePassword">Hide</span>
						<span v-else>Show</span>
					</button>
				</div>

				<div
					v-if="showPasswordMeter"
					role="tooltip"
					tabindex="0"
					class="card dropdown-content card-compact absolute top-24 z-[1] w-64 bg-base-100 p-2 text-base-content shadow"
				>
					<div class="card-body">
						<PasswordStrength :password="formData.newPassword" />
					</div>
				</div>
			</div>

			<KwTextField
				id="confirmNewPassword"
				v-model="formData.confirmNewPassword"
				class="form-control w-full"
				label="Confirm new password"
				name="confirmNewPassword"
				required
				:rules="['isMatch']"
				:validation-match="formData.newPassword"
				error-message-prefix="Passwords"
				:type="passwordFieldType"
				autocomplete="off"
			/>
		</div>

		<div class="mt-8 flex justify-end gap-6">
			<KwButton
				variant="primary"
				text="Save"
				type="submit"
				:disabled="isSubmitting"
				:loading="isSubmitting"
			/>
		</div>
	</KwForm>
</template>
