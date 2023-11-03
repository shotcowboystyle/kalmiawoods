<script setup>
	import UserAvatar from '@/components/UserAvatar.vue';
	import { $authUser } from '@/stores/auth';
</script>

<template>
	<UserAvatar
		:name="$authUser.name"
		:avatar="$authUser.avatar"
	>
		<slot />
	</UserAvatar>
</template>
