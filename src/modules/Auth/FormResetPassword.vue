<script setup lang="ts">
	import { HOME, UNEXPECTED_SERVER_ERROR_MESSAGE } from '@/app/constants';
	import PasswordStrength from '@/components/PasswordStrength.vue';
	import { fetchPost } from '@/utils/fetchClient';
	import { useToast } from 'vue-toastification';

	export interface Props {
		token: string;
	}

	const props = withDefaults(defineProps<Props>(), {
		token: undefined,
	});

	const toast = useToast();

	const hidePassword = ref(true);
	const showPasswordMeter = ref(false);
	const togglePasswordVisibility = () => (hidePassword.value = !hidePassword.value);
	const passwordFieldType = computed(() => (hidePassword.value ? 'password' : 'text'));

	const isSubmitting = ref(false);
	const formData = reactive({
		newPassword: undefined,
		confirmNewPassword: undefined,
	});

	async function submit() {
		isSubmitting.value = true;

		try {
			const response = await fetchPost(`auth/password-reset/${props.token}`, {
				password: formData.newPassword,
			});
			if (response.status === 200) {
				location.href = HOME;
			} else {
				toast.error(UNEXPECTED_SERVER_ERROR_MESSAGE);
			}
		} catch (error) {
			toast.error(JSON.parse(error).message);
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
		<div class="w-full">
			<div class="relative">
				<KwTextField
					id="newPassword"
					v-model="formData.newPassword"
					class="form-control mb-4 w-full"
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
				class="form-control mb-4 w-full"
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

		<div class="mt-8 flex justify-start gap-6">
			<KwButton
				variant="primary"
				size="block"
				text="Reset Password"
				type="submit"
				:disabled="isSubmitting"
				:loading="isSubmitting"
			/>
		</div>
	</KwForm>
</template>
