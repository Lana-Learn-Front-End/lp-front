<template>
  <div class="img-container elevation-2">
    <v-img
      v-if="src"
      :src="src"
      :aspect-ratio="aspectRatio"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <base-placeholder-image
      v-if="!src"
      :aspect-ratio="aspectRatio"
      :icon="loading ? '' : 'insert_photo'"
    >
    </base-placeholder-image>

    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>

    <div v-show="!img && !loading" class="img-btn">
      <v-btn
        fab
        small
        @click="$refs.file.click()"
      >
        <v-icon>edit</v-icon>
      </v-btn>

      <v-btn
        v-show="src"
        fab
        small
        class="ml-2 error--text"
        @click="remove()"
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
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import BasePlaceholderImage from '@/components/BasePlaceholderImage.vue';

@Component({
  components: { BasePlaceholderImage },
})
export default class BaseImagePicker extends Vue {
  @Prop() defaultImage!: string;
  @Prop() loading!: boolean;
  @Prop() aspectRatio!: number | string;

  src = '';
  img?: File;

  $refs!: {
    file: HTMLInputElement;
  };

  data() {
    return {
      img: undefined,
    };
  }

  @Watch('defaultImage', { immediate: true })
  onDefaultImageChange(src: string) {
    this.src = src;
    this.img = undefined;
  }

  onImgPicked(files: FileList) {
    if (files.length > 0) {
      [this.img] = files;
      this.src = URL.createObjectURL(this.img);
    }
  }

  @Emit()
  upload(): File | undefined {
    return this.img;
  }

  @Emit()
  remove() {
    this.img = undefined;
    this.src = this.defaultImage || '';
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
