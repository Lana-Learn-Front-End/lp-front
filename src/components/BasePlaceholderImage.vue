<template>
  <v-responsive
    class="h-100"
    :aspect-ratio="aspectRatio"
  >
    <div class="h-100 w-100 d-flex justify-center align-center grey darken-4">
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
      <v-icon v-else x-large>{{ icon }}</v-icon>
    </div>
  </v-responsive>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BasePlaceholderImage extends Vue {
  @Prop({ type: String, default: 'insert_photo' }) icon!: string;
  @Prop() aspectRatio!: string | number;
  @Prop() loading!: boolean;
}
</script>
