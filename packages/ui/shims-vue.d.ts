declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// this is a temporary fix for the alpha.6 v-calendar version
declare module 'v-calendar' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  export const SetupCalendar: any;
  export const Calendar: DefineComponent;
  export const DatePicker: DefineComponent;
  export const Popover: DefineComponent;
  export const PopoverRow: DefineComponent;
}
