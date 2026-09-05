export const phoneFormatUSA = (input: string) => {
	if (!input) {
		return null;
	}

	if (input?.length === 10) {
		return `+1 ${input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`;
	}

	if (input?.length < 10) {
		return 'was not supplied enough numbers please pass a 10 digit number';
	}

	if (input?.length > 10) {
		return 'was supplied too many numbers please pass a 10 digit number';
	}

	return 'something went wrong';
};

/*******************************************************
 * formatPhoneText
 * returns a string that is in NNN-NNN-NNNN format
 *******************************************************/
export const formatPhoneInputUSA = (value: string) => {
	let formattedValue = value.trim().replaceAll('-', '');

	if (value.length > 3 && value.length <= 6) {
		formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3);
	} else if (formattedValue.length > 6) {
		formattedValue =
			formattedValue.slice(0, 3) + '-' + formattedValue.slice(3, 6) + '-' + formattedValue.slice(6);
	}

	return formattedValue;
};

/*******************************************************
 * validatePhone
 * return true if the string 'p' is a valid phone
 *******************************************************/
export const validatePhoneUSA = (p: string) => {
	const phoneRegex = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s.]{0,1}[0-9]{3}[-\s.]{0,1}[0-9]{4}$/;
	const digits = p.replace(/\D/g, '');
	return phoneRegex.test(digits);
};
