<script setup lang="ts">
	import { logout } from '@/stores/auth';
	import { useToast } from 'vue-toastification';

	const toast = useToast();

	const handleLogout = async () => {
		try {
			await logout();
			location.href = '/auth/login';
		} catch (error: any) {
			toast.error(error.message);
		}
	};
</script>

<template>
	<li>
		<a
			href="/"
			@click.prevent="handleLogout"
			>Logout</a
		>
	</li>
</template>
