import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NotifySnackbarMixin extends Vue {
  showErrorSnackbar(
    error: string,
    code?: string | number,
    options?: {
      timeout?: number;
      closeable?: boolean;
    },
  ) {
    this.$snackbar.showError({
      message: error,
      code,
      ...options,
    });
    this.$snackbar.showError({
      message: error,
      ...options,
    });
  }

  showSnackbar(
    message: string,
    options?: {
      color?: string;
      timeout?: number;
      closeable?: boolean;
    },
  ) {
    this.$snackbar.show({
      message,
      ...options,
    });
  }
}
