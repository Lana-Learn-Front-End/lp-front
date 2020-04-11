import { AxiosInstance } from 'axios';
import { SnackBar } from '@/plugins/snackbar';
import { EventBus } from '@/plugins/event-bus';

declare global {
  interface Window {
    axios: AxiosInstance;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
    $snackbar: SnackBar;
    $bus: EventBus
  }

  interface VueConstructor {
    $axios: AxiosInstance;
    $snackbar: SnackBar;
    $bus: EventBus
  }
}
