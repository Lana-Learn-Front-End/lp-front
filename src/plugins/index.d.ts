import { SnackBar } from '@/plugins/notify/snackbar';
import { EventBus } from '@/plugins/event-bus';
import { NotifyModal } from '@/plugins/notify/notify-modal';

declare module 'vue/types/vue' {

  interface Vue {
    $snackbar: SnackBar;
    $modal: NotifyModal;
    $bus: EventBus;
  }

  interface VueConstructor {
    $snackbar: SnackBar;
    $modal: NotifyModal;
    $bus: EventBus;
  }
}
