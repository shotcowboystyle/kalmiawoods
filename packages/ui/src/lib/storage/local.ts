import { Storage } from '../../types';

export class LocalStorage implements Storage {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string, defaultValue: string) {
    try {
      const value = localStorage.getItem(key);
      return JSON.parse(value!);
    } catch {
      return defaultValue;
    }
  }

  remove(key: string) {
    localStorage.remove(key);
  }

  clear() {
    localStorage.clear();
  }
}
