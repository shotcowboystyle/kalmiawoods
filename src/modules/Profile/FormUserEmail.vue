<script setup lang="ts">
	import { $activeUserId, $allUserEmails, $user, updateUser } from '@/stores/user';
	import { fetchPut } from '@/utils/fetchClient';
	import { useToast } from 'vue-toastification';

	const toast = useToast();

	const isSubmitting = ref(false);
	const emailModel = ref('');

	async function submit() {
		isSubmitting.value = true;

		try {
			const response = await fetchPut(`admin/users/${$activeUserId.value}/email`, {
				newEmail: emailModel.value,
			});

			const data = await response.json();
			updateUser(data);
			toast.success('Update successful.');
			emailModel.value = '';
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			isSubmitting.value = false;
		}
	}
</script>

<template>
	<KwForm @submit="submit">
		<p class="mb-4">Current email: {{ $user.email }}</p>
		<KwTextField
			id="newEmail"
			v-model="emailModel"
			class="form-control mb-4 w-full"
			label="New email"
			name="newEmail"
			required
			:rules="['email', 'isUnique']"
			:validation-matchers="$allUserEmails"
			error-message-prefix="Email"
			type="email"
			autocomplete="off"
		/>

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
