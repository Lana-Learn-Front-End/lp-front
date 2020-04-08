<template>
  <div>
    <v-snackbar
      :timeout="timeout"
      :color="color"
      v-model="activeState"
    >
      {{ message }}
      <v-btn
        dark
        text
        v-show="closeable"
        @click="activeState = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const snackbarModule = namespace('snackbar');

@Component
export default class TheSnackbar extends Vue {
  @snackbarModule.State message!: string;
  @snackbarModule.State color!: string;
  @snackbarModule.State timeout!: string;
  @snackbarModule.State active!: boolean;
  @snackbarModule.State closeable!: boolean;

  @snackbarModule.Mutation hide!: () => void;

  get activeState() {
    return this.active;
  }

  set activeState(state: boolean) {
    if (!state) {
      this.hide();
    }
  }
}
</script>
