import { AxiosInstance } from 'axios';
import { SnackBar } from '@/plugins/notify/snackbar';
import { EventBus } from '@/plugins/event-bus';
import { NotifyModal } from '@/plugins/notify/notify-modal';

declare module 'vue/types/vue' {

  interface Vue {
    $axios: AxiosInstance;
    $snackbar: SnackBar;
    $modal: NotifyModal;
    $bus: EventBus;
  }

  interface VueConstructor {
    $axios: AxiosInstance;
    $snackbar: SnackBar;
    $modal: NotifyModal;
    $bus: EventBus;
  }
}
