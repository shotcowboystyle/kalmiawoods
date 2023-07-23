const padTo2Digits = (num: number) => num.toString().padStart(2, '0');

export const formatQueryDateRange = (date: Date) =>
  `${[date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-')} ${[
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds()),
  ].join(':')}`;

export const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1);

// ✅ Get the first day of the current month
export const firstDayOfCurrentMonth = () => {
  const date = new Date();
  return getFirstDayOfMonth(date.getFullYear(), date.getMonth());
};

export const getLastDayOfMonth = (year: number, month: number) => new Date(year, month + 1, 0);

// ✅ Get the last day of current month
export const lastDayOfCurrentMonth = () => {
  const date = new Date();
  return getLastDayOfMonth(date.getFullYear(), date.getMonth());
};

export const getTimeAfterSeconds = (seconds: number) => {
  return new Date().getTime() + 1000 * seconds;
};

export const isWithinExpiration = (expiresInMs: number | bigint) => {
  const currentTime = Date.now();
  if (currentTime > expiresInMs) {
    return false;
  }
  return true;
};

export const dateInPast = function (date: Date) {
  if (date.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
    return true;
  }

  return false;
};
