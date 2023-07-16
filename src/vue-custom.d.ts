export {};

declare module 'vue' {
  interface ComponentCustomProperties {
    $toastItems: { push: Function };
  }
}
