import Vue, { PluginObject, VueConstructor } from 'vue';

const SnackbarPlugin: PluginObject<SnackBarPluginOptions> = {
  install(Vue: VueConstructor, opts?: SnackBarPluginOptions) {
    const defaultOptions: SnackBarPluginOptions = {
      color: '',
      timeout: 0,
      closeable: true,
      ...opts,
    };

    Vue.prototype.$snackbar = {
      show: (options: SnackbarOptions) => {
        Vue.prototype.$bus.$emit('snackbar-show', { ...defaultOptions, ...options });
      },
      showError: (options: ErrorSnackbarOptions) => {
        options.message = `${options.message} ${options.code ? `(${options.code})` : ''}`;
        delete options.code;
        Vue.prototype.$bus.$emit('snackbar-show', {
          ...defaultOptions,
          ...options,
          color: 'error',
        });
      },
    };
  },
};

Vue.use(SnackbarPlugin, {
  timeout: 2000,
});

export interface SnackBarPluginOptions {
  color: string;
  timeout: number;
  closeable: boolean;
}

export interface SnackBar {
  show(options: SnackbarOptions): void;

  showError(options: ErrorSnackbarOptions): void;
}

export interface SnackbarOptions {
  message: string;
  color?: string;
  timeout?: number;
  closeable?: boolean;
}

interface ErrorSnackbarOptions {
  message: string | number;
  code?: string | number;
  timeout?: number;
  closeable?: boolean;
}
