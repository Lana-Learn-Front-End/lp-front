import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({
  namespaced: true,
})
export default class Snackbar extends VuexModule {
  active = false;
  message = '';
  color = '';
  timeout = 2000;
  closeable = false;

  @Mutation
  hide() {
    this.active = false;
  }

  @Mutation
  show({
    message,
    color = '',
    timeout = 2000,
    closeable = true,
  }: SnackbarOptions) {
    this.message = message;
    this.closeable = closeable;
    this.color = color;
    this.timeout = timeout;
    this.active = true;
  }

  @Mutation
  showError({
    error,
    code = '',
    timeout = 2000,
    closeable = true,
  }: ErrorSnackbarOptions) {
    this.message = `${error} ${code !== undefined ? `(${code})` : ''}`;
    this.color = 'error';
    this.timeout = timeout;
    this.closeable = closeable;
    this.active = true;
  }
}

export interface SnackbarOptions {
  message: string;
  color: string;
  timeout: number;
  closeable: boolean;
}

export interface ErrorSnackbarOptions {
  code: string | number;
  error: string;
  timeout: number;
  closeable: boolean;
}
