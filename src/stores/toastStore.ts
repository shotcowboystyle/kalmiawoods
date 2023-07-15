import { atom } from 'nanostores';

export const snack = atom({ isOpen: false, message: '', type: 'info' });

export const openSnack = (message: string, type: string = 'info') => {
  snack.set({ isOpen: true, message, type });
};

export const closeSnack = () => {
  snack.set({ isOpen: false, message: '', type: 'info' });
};
