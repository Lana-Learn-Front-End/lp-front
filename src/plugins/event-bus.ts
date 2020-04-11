import Vue, { PluginObject } from 'vue';

const Bus: PluginObject<void> = {
  install: (Vue) => {
    Vue.prototype.$bus = new Vue();
  },
};

Vue.use(Bus);

export interface EventBus {
  $on(event: string | string[], callback: Function): Vue;

  $once(event: string | string[], callback: Function): Vue;

  $off(event?: string | string[], callback?: Function): Vue;

  $emit(event: string, ...args: any[]): Vue;
}
