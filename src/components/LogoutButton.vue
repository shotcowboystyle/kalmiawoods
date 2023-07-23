<script setup lang="ts">
import { useToast } from 'vue-toastification';

import { logout } from '@/stores/auth';

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
  <li><a href="/" @click.prevent="handleLogout">Logout</a></li>
</template>
