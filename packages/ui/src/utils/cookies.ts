interface CookieOptions {
  name: String;
  value: String;
  lifetime?: Number;
  isHttpOnly?: Boolean;
}

export const createSetCookieHeader = (options: CookieOptions): [string, string] => {
  return [
    `Set-Cookie`,
    `${options.name}="${options.value}"; SameSite=Strict; Path=/; ${
      options.lifetime !== undefined ? `Max-Age=${options.lifetime};` : ''
    } ${options.isHttpOnly ? 'HttpOnly;' : ''}`,
  ];
};

export const parseCookie = (str: string) => {
  if (!str) {
    return {};
  }
  return str
    .split(';')
    .map((v) => v.split('='))
    .reduce(
      (
        acc: {
          [key: string]: string;
        },
        v,
      ) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      },
      {},
    );
};
