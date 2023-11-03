<script setup lang="ts">
	import { usePasswordChecker } from '@/composables/usePasswordChecker';

	const props = defineProps({
		password: {
			type: String,
			default: '',
		},
	});

	const emit = defineEmits(['score']);

	const { checkStrength, scorePassword, hasSpecialChar, hasLowerCase, hasUpperCase, hasNumber } =
		usePasswordChecker();

	const containsNumber = computed(() => props.password && hasNumber(props.password));
	const containsUppercase = computed(() => props.password && hasUpperCase(props.password));
	const containsLowercase = computed(() => props.password && hasLowerCase(props.password));
	const containsSpecialChar = computed(() => props.password && hasSpecialChar(props.password));

	const passwordClass = computed(() => {
		if (!props.password) {
			return null;
		}

		const strength = checkStrength(props.password);
		const score = scorePassword(props.password);
		emit('score', { score, strength });

		return {
			[strength]: true,
			scored: true,
		};
	});
</script>

<template>
	<div
		class="po-password-strength-bar mb-4"
		:class="passwordClass"
	></div>
	<ul>
		<li class="mb-1 flex items-center">
			<svg
				v-if="containsUppercase"
				class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				></path>
			</svg>
			<svg
				v-else
				class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
			Has a capital letter
		</li>
		<li class="mb-1 flex items-center">
			<svg
				v-if="containsLowercase"
				class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				></path>
			</svg>
			<svg
				v-else
				class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
			Has a lowercase letter
		</li>
		<li class="mb-1 flex items-center">
			<svg
				v-if="containsNumber"
				class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				></path>
			</svg>
			<svg
				v-else
				class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
			Has a number
		</li>
		<li class="mb-1 flex items-center">
			<svg
				v-if="containsSpecialChar"
				class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				></path>
			</svg>
			<svg
				v-else
				class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
			Has a special character
		</li>
		<li class="flex items-center">
			<svg
				v-if="password.length >= 8"
				class="mr-2 h-4 w-4 text-green-400 dark:text-green-500"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				></path>
			</svg>
			<svg
				v-else
				class="mr-2 h-4 w-4 text-gray-300 dark:text-gray-400"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
			Longer than 7 characters
		</li>
	</ul>
</template>

<style lang="postcss">
	.po-password-strength-bar {
		@apply mt-2 h-1 rounded-sm bg-slate-100;
		transition: all 0.2s linear;
	}

	.po-password-strength-bar.risky {
		@apply w-1/5 bg-error;
	}

	.po-password-strength-bar.guessable {
		@apply w-2/5 bg-warning;
	}

	.po-password-strength-bar.weak {
		@apply w-3/5 bg-yellow-400;
	}

	.po-password-strength-bar.safe {
		@apply w-4/5 bg-emerald-400;
	}

	.po-password-strength-bar.secure {
		@apply w-full bg-green-600;
	}
</style>
