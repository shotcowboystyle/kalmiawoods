import { parse } from '@lukeed/ms';

export class CookieUtils {
  public static getRefreshExpirationDateTime(refreshTtl: string): Date {
    const timeInMinutes = Math.floor(Number(parse(refreshTtl)) / 6000);

    return new Date(new Date().setMinutes(timeInMinutes));
  }
}
