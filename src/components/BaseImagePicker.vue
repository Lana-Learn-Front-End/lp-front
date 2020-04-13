<template>
  <div class="img-container elevation-2">
    <v-img
      v-if="src && !loading"
      :src="src"
      :aspect-ratio="aspectRatio"
    >
    </v-img>

    <base-placeholder-image
      v-if="!src || loading"
      :aspect-ratio="aspectRatio"
      :loading="loading"
    >
    </base-placeholder-image>

    <div v-show="!img || loading" class="img-btn">
      <v-btn
        fab
        small
        @click="$refs.file.click()"
        :loading="loading"
        :disabled="loading"
      >
        <v-icon>edit</v-icon>
      </v-btn>

      <v-btn
        v-show="src"
        fab
        small
        class="ml-2 error--text"
        @click="remove()"
        :loading="loading"
        :disabled="loading"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </div>

    <div v-show="img && !loading" class="img-btn">
      <v-btn
        fab
        small
        @click="upload()"
      >
        <v-icon>cloud_upload</v-icon>
      </v-btn>
      <v-btn
        fab
        small
        class="ml-2 error--text"
        @click="img = undefined"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </div>

    <input
      type="file"
      ref="file"
      class="d-none"
      accept=".png, .jpg, .jpeg"
      @change="onImgPicked($event.target.files)"
    >
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import BasePlaceholderImage from '@/components/BasePlaceholderImage.vue';

@Component({
  components: { BasePlaceholderImage },
})
export default class BaseImagePicker extends Vue {
  @Prop() defaultImage!: string;
  @Prop() loading!: boolean;
  @Prop() aspectRatio!: number | string;

  img?: File;

  $refs!: {
    file: HTMLInputElement;
  };

  data() {
    return {
      img: undefined,
    };
  }

  get src(): string {
    if (this.img) {
      return URL.createObjectURL(this.img);
    }
    return this.defaultImage || '';
  }

  onImgPicked(files: FileList) {
    if (files.length > 0) {
      [this.img] = files;
    }
  }

  @Emit()
  upload(): File | undefined {
    const blob: File | undefined = this.img;
    this.img = undefined;
    return blob;
  }

  @Emit()
  remove() {
    this.img = undefined;
  }
}
</script>

<style scoped>
  .img-container {
    width: 100%;
    position: relative;
  }

  .img-btn {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
</style>
