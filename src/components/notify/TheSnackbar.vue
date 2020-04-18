<template>
  <div>
    <v-snackbar
      :timeout="0"
      :color="options.color"
      v-model="active"
    >
      {{ options.message }}
      <v-btn
        dark
        text
        v-show="options.closeable"
        @click="active = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SnackbarOptions } from '@/plugins/notify/snackbar';

@Component
export default class TheSnackbar extends Vue {
  private timeOutId?: number;
  options: SnackbarOptions = {
    timeout: 0,
    color: '',
    message: '',
    closeable: false,
  };
  active = false;

  data() {
    return {
      timeOutId: undefined,
    };
  }

  beforeMount() {
    this.$bus.$on('snackbar-show', (options: SnackbarOptions) => {
      this.active = false;
      Object.assign(this.options, options);

      clearTimeout(this.timeOutId);
      if (this.options.timeout) {
        this.timeOutId = setTimeout(() => {
          this.active = false;
        }, this.options.timeout);
      }
      this.active = true;
    });
  }
}
</script>
