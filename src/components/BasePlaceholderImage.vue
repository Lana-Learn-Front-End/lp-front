<template>
  <v-responsive
    class="h-100"
    :aspect-ratio="aspectRatio"
  >
    <div class="h-100 w-100 d-flex justify-center align-center grey darken-4">
      <v-icon x-large>{{ icon }}</v-icon>
    </div>
  </v-responsive>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BasePlaceholderImage extends Vue {
  @Prop({ type: String, default: 'insert_photo' }) icon!: string;
  @Prop() aspectRatio!: string | number;
}
</script>
