<template>
  <div>
    <v-snackbar
      :timeout="options.timeout"
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
import { SnackbarOptions } from '@/plugins/snackbar';

@Component
export default class TheSnackbar extends Vue {
  options: SnackbarOptions = {
    color: '',
    timeout: 0,
    message: '',
    closeable: false,
  };
  active = false;

  beforeMount() {
    this.$bus.$on('snackbar-show', (options: SnackbarOptions) => {
      Object.assign(this.options, options);
      this.active = true;
    });
  }
}
</script>
