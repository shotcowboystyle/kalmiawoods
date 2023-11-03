<script setup lang="ts">
	import { fetchPost } from '@/utils/fetchClient';
	import { useToast } from 'vue-toastification';

	const toast = useToast();

	const isSubmitting = ref(false);
	const formData = reactive({
		email: '',
	});

	async function submit() {
		isSubmitting.value = true;

		try {
			const response = await fetchPost('auth/password-reset', formData);
			const data = await response.json();
			toast.success(data.message);
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			isSubmitting.value = false;
		}
	}
</script>

<template>
	<KwForm
		class="mt-8 space-y-6"
		@submit="submit"
	>
		<KwTextField
			id="email"
			v-model="formData.email"
			class="form-control w-full"
			label="Email"
			name="email"
			type="email"
		/>
		<!-- required -->
		<!-- :rules="['email']" -->

		<div class="flex flex-wrap items-start">
			Remember your password? &nbsp;
			<a
				href="/auth/login"
				class="link text-primary"
				>Login</a
			>.
		</div>

		<div class="mt-8 flex justify-start gap-6">
			<KwButton
				variant="primary"
				size="block"
				text="Send Email"
				type="submit"
				:disabled="isSubmitting"
				:loading="isSubmitting"
			/>
		</div>
	</KwForm>
</template>
