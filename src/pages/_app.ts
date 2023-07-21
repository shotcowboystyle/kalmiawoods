import type { App } from 'vue';
import type { PluginOptions } from 'vue-toastification';
import Toast, { POSITION } from 'vue-toastification';

const toastOptions: PluginOptions = {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
};

export default (app: App) => {
  app.use(Toast, toastOptions);
};
