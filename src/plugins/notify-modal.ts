import Vue, { PluginObject, VueConstructor } from 'vue';

const NotifyModalPlugin: PluginObject<void> = {
  install(Vue: VueConstructor) {
    Vue.prototype.$modal = {
      alert(message: string): Promise<void> {
        Vue.prototype.$bus.$emit('notify-modal-alert', { message });
        return new Promise<void>((resolve) => {
          Vue.prototype.$bus.$once('notify-modal-alert-cb', () => resolve());
        });
      },

      confirm(message: string): Promise<boolean> {
        Vue.prototype.$bus.$emit('notify-modal-confirm', { message });
        return new Promise<boolean>((resolve) => {
          Vue.prototype.$bus.$once(
            'notify-modal-confirm-cb',
            (accept: boolean) => resolve(accept),
          );
        });
      },
    };
  },
};

Vue.use(NotifyModalPlugin);

export interface NotifyModal {
  alert(message: string): Promise<void>;

  confirm(message: string): Promise<boolean>;
}
