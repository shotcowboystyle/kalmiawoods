export const emailRegex = /^.+@.+/;

export const isValidEmail = (maybeEmail: unknown): maybeEmail is string => {
	if (typeof maybeEmail !== 'string') {
		return false;
	}
	return emailRegex.test(maybeEmail);
};
