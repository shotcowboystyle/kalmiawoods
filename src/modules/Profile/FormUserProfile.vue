<script setup lang="ts">
	import { $activeUserId, $allUserMobilePhones, profileData, updateUser } from '@/stores/user';
	import { fetchPut } from '@/utils/fetchClient';
	import { formatPhoneInputUSA } from '@/utils/phone';
	import { useVModel } from '@nanostores/vue';
	import { useToast } from 'vue-toastification';

	const emit = defineEmits(['input-mobile-phone']);

	const toast = useToast();

	const isSubmitting = ref(false);
	const { firstNameModel, lastNameModel, mobilePhoneModel, addressModel } = useVModel(profileData, [
		'firstName',
		'lastName',
		'mobilePhone',
		'address',
	]);

	const maskPhone = (event: Event) => {
		const { value } = event.target as HTMLInputElement;
		mobilePhoneModel.value = formatPhoneInputUSA(value);
		emit('input-mobile-phone', mobilePhoneModel);
	};

	async function submit() {
		isSubmitting.value = true;

		const formData = profileData;
		// const changedData = diff($user.value, formData);

		try {
			const response = await fetchPut(`admin/users/${$activeUserId.value}/profile`, {
				userId: $activeUserId.value,
				profileData: formData,
			});
			const data = await response.json();
			updateUser(data);
			toast.success('Update successful.');
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
				v-model="firstNameModel"
				type="text"
				class="form-control w-full"
				label="First name"
				name="firstName"
				placeholder="enter user's first name"
				required
			/>

			<KwTextField
				id="lastName"
				v-model="lastNameModel"
				type="text"
				class="form-control w-full"
				label="Last name"
				name="lastName"
				placeholder="enter user's last name"
				required
			/>
		</div>

		<KwTextField
			id="mobilePhone"
			v-model="mobilePhoneModel"
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
			v-model="addressModel"
			type="text"
			class="form-control mb-4 w-full"
			label="Address"
			name="address"
			placeholder="enter user's address"
		/>

		<div class="mt-8 flex justify-end gap-6">
			<KwButton
				variant="primary"
				text="Save"
				icon-right="arrow-right"
				type="submit"
				:disabled="isSubmitting"
				:loading="isSubmitting"
			/>
		</div>
	</KwForm>
</template>
