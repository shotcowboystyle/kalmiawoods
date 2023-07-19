const specialCharRegex = /[!@#\$%\^\&*\)\(+=._-]/;
const lowercaseRegex = /[a-z]/;
const uppercaseRegex = /[A-Z]/;
const numberRegex = /\d/;
const repeatCharRegex = /(\w)(\1+\1+\1+\1+)/g;

const nameScore = (score: number): string => {
  switch (score) {
    case 0:
      return 'risky';
    case 1:
      return 'guessable';
    case 2:
      return 'weak';
    case 3:
      return 'safe';
    case 4:
      return 'secure';
    default:
      return '';
  }
};

// common passwords as an array of strings
const commonPasswords = [
  '123456',
  'qwerty',
  'password',
  '111111',
  'Abc123',
  '123456789',
  '12345678',
  '123123',
  '1234567890',
  '12345',
  '1234567',
  'qwertyuiop',
  'qwerty123',
  '1q2w3e',
  'password1',
  '123321',
  'Iloveyou',
  '12345',
];

const isCommonPassword = (password: string): boolean => commonPasswords.includes(password);

export const usePasswordChecker = () => {
  const hasSpecialChar = (pass: string): boolean => specialCharRegex.test(pass);
  const hasLowerCase = (pass: string): boolean => lowercaseRegex.test(pass);
  const hasUpperCase = (pass: string): boolean => uppercaseRegex.test(pass);
  const hasNumber = (pass: string): boolean => numberRegex.test(pass);
  const hasRepeatChars = (pass: string): boolean => repeatCharRegex.test(pass);

  const checkStrength = (pass: string) => {
    const score = scorePassword(pass);
    return nameScore(score);
  };

  const scorePassword = (pass: string): number => {
    let score = 0;
    let length = 0;
    let specialChar = 0;
    let caseMix = 0;
    let numCharMix = 0;

    if (pass.length > 4) {
      if (isCommonPassword(pass)) {
        return 0;
      }

      if ((hasLowerCase(pass) || hasUpperCase(pass)) && hasNumber(pass)) {
        numCharMix = 1;
      }

      if (hasUpperCase(pass) && hasLowerCase(pass)) {
        caseMix = 1;
      }

      if ((hasLowerCase(pass) || hasUpperCase(pass) || hasNumber(pass)) && hasSpecialChar(pass)) {
        specialChar = 1;
      }

      if (pass.length > 8) {
        length = 1;
      }

      if (pass.length > 12 && !hasRepeatChars(pass)) {
        length = 2;
      }

      if (pass.length > 20 && !hasRepeatChars(pass)) {
        length = 3;
      }

      score = length + specialChar + caseMix + numCharMix;

      if (score > 4) {
        score = 4;
      }
    }

    return score;
  };

  return {
    checkStrength,
    scorePassword,
    hasSpecialChar,
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasRepeatChars,
  };
};
