import validators from '@/utils/validators';

type Validators = typeof validators;
type ValidatorRulesKeys = keyof Validators;
type ValidatorRules = 'email' | 'phone' | 'password' | 'isMatch' | 'isUnique' | 'required';

export function useFormValidator() {
	function allRules(required: boolean, rules: string[]) {
		if (!rules && required) {
			return ['required'];
		}

		if (required && !rules.includes('required')) {
			return ['required', ...rules];
		}

		return rules;
	}

	function validate(
		value: string[] | string,
		rules: Array<string | { isValid: Function; errorMessage: string }>,
		extraArgs: { match?: string; matchers?: string[]; errorMessagePrefix?: string } = {},
	): { isValid: boolean; errorMessage?: string } {
		const errorMessage = ref('');
		if (!Array.isArray(rules) || rules.length <= 0) {
			return { isValid: true };
		}
		if ((!value || value?.length <= 0) && !rules.includes('required')) {
			return { isValid: true };
		}

		const normalizedValue = rules.includes('phone') ? (value as string).replace(/\D/g, '') : value;

		const failedRule = rules.find((rule: string | { isValid: Function; errorMessage: string }) => {
			if (
				typeof rule === 'function' ||
				(validators[rule as ValidatorRulesKeys] === null && typeof rule !== 'object')
			) {
				return false;
			}

			if (typeof rule === 'object') {
				return !rule.isValid(normalizedValue);
			}

			return validators[rule as ValidatorRules](normalizedValue, extraArgs).isValid === false;
		});

		if (failedRule) {
			if (typeof failedRule === 'object') {
				errorMessage.value = failedRule.errorMessage;
				return { isValid: !failedRule };
			}

			const failedValidator = validators[failedRule as ValidatorRules](normalizedValue, extraArgs);

			errorMessage.value = failedValidator.errorMessage;
		}

		return { isValid: !failedRule, errorMessage: errorMessage.value };
	}

	return { validate, allRules };
}
