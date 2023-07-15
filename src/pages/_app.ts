import toast from '@/plugins/toast';
import type { App } from 'vue';

export default (app: App) => {
  app.use(toast);
  return app;
};
