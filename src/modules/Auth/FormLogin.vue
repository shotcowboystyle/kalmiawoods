<script setup lang="ts">
	import { HOME } from '@/app/constants';
	import { login } from '@/stores/auth';

	const showErrorMessage = ref(false);
	const isSubmitting = ref(false);
	const formData = reactive({
		email: '',
		password: '',
	});

	async function submit() {
		isSubmitting.value = true;

		try {
			await login(formData);
			location.href = HOME;
		} catch {
			showErrorMessage.value = true;
		} finally {
			isSubmitting.value = false;
		}
	}
</script>

<template>
	<div
		v-if="showErrorMessage"
		class="mb-4 text-sm font-normal text-red-600"
	>
		Incorrect email or password
	</div>
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
			:rules="['email']"
			required
			type="email"
		/>

		<KwTextField
			id="password"
			v-model="formData.password"
			class="form-control w-full"
			label="Password"
			name="password"
			required
			type="password"
		/>

		<div class="text-right">
			<a
				href="/auth/password-reset"
				class="link text-primary"
			>
				Lost Password?
			</a>
		</div>

		<div class="mt-8 flex justify-start gap-6">
			<KwButton
				variant="primary"
				size="block"
				text="Login"
				type="submit"
				:disabled="isSubmitting"
				:loading="isSubmitting"
			/>
		</div>
	</KwForm>
</template>
