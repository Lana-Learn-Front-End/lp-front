<template>
  <v-dialog v-model="dialog" max-width="400px" persistent>
    <v-card>
      <v-card-title
        :class="{
          'title': $vuetify.breakpoint.mdAndUp,
          'subtitle-1 font-weight-bold': $vuetify.breakpoint.smAndDown
        }"
      >
        {{ options.message }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn ref="btn" text @click="ok()">Ok</v-btn>
        <v-btn
          text
          v-show="options.type !== 'alert'"
          class="error--text"
          @click="cancel()"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Hook } from '@/core/decorators';

@Component
export default class TheNotifyModal extends Vue {
  dialog = false;
  options: ModalOptions = {
    message: '',
    type: 'alert',
  };

  @Hook()
  beforeMount() {
    this.$bus.$on('notify-modal-alert', (opts: ModalOptions) => {
      opts.type = 'alert';
      Object.assign(this.options, opts);
      this.dialog = true;
    });

    this.$bus.$on('notify-modal-confirm', (opts: ModalOptions) => {
      opts.type = 'confirm';
      Object.assign(this.options, opts);
      this.dialog = true;
    });
  }

  ok() {
    if (this.options.type === 'confirm') {
      this.$bus.$emit('notify-modal-confirm-cb', true);
    } else {
      this.$bus.$emit('notify-modal-alert-cb');
    }
    this.dialog = false;
  }

  cancel() {
    if (this.options.type === 'confirm') {
      this.$bus.$emit('notify-modal-confirm-cb', false);
    }
    this.dialog = false;
  }
}

interface ModalOptions {
  message: string;
  type: 'alert' | 'confirm';
}

</script>
