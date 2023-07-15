import validators from '@/utils/validators';

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
    value: string,
    rules: Array<string | { isValid: Function; errorMessage: string }>,
    extraArgs: { matchers?: string[]; errorMessagePrefix?: string } = {},
  ) {
    const errorMessage = ref('');
    if (!Array.isArray(rules) || rules.length <= 0) {
      return true;
    }
    if ((!value || value?.length <= 0) && !rules.includes('required')) {
      return true;
    }

    const normalizedValue = rules.includes('phone') ? value.replace(/\D/g, '') : value;

    const failedRule = rules.find((rule: string | { isValid: Function; errorMessage: string }) => {
      if (
        typeof rule === 'function' ||
        (validators[rule as 'email' | 'phone' | 'password' | 'isUnique' | 'required'] == null &&
          typeof rule !== 'object')
      ) {
        return false;
      }

      if (typeof rule === 'object') {
        return !rule.isValid(normalizedValue);
      }

      return (
        validators[rule as 'email' | 'phone' | 'password' | 'isUnique' | 'required'](normalizedValue, extraArgs)
          .isValid === false
      );
    });

    if (failedRule) {
      if (typeof failedRule === 'object') {
        errorMessage.value = failedRule.errorMessage;
        return !failedRule;
      }

      const failedValidator = validators[failedRule as 'email' | 'phone' | 'password' | 'isUnique' | 'required'](
        normalizedValue,
        extraArgs,
      );

      errorMessage.value = failedValidator.errorMessage;
    }

    return { isValid: !failedRule, errorMessage: errorMessage.value };
  }

  return { validate, allRules };
}
