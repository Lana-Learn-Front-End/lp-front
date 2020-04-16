<template>
  <base-image-picker
    :default-image="src | mediaSource('images')"
    :loading="loading"
    :aspect-ratio="1"
    @upload="onUpload($event)"
    @remove="onRemove()"
  >
  </base-image-picker>
</template>

<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator';
import Cast from '@/models/cast';
import { mixins } from 'vue-class-component';
import NotifySnackbarMixin from '@/mixins/notify-snackbar-mixin';
import BaseImagePicker from '@/components/BaseImagePicker.vue';
import FileApi, { FileType } from '@/api/file-api';
import { AxiosResponse } from 'axios';
import FileMetadata from '@/models/file-metadata';
import CastApi from '@/api/cast-api';


@Component({
  components: { BaseImagePicker },
})
export default class CastCoverUpload extends mixins(NotifySnackbarMixin) {
  @Prop() cast!: Cast;
  loading = false;

  get src(): string {
    return this.cast?.image || '';
  }

  @Emit()
  imageChange(src: string): string {
    this.showSnackbar('Image changed successfully!');
    return src;
  }

  async onUpload(img: File): Promise<void> {
    this.loading = true;
    try {
      if (this.cast.image) {
        await FileApi.update(FileType.IMAGE, this.cast.image, img);
        this.imageChange(this.cast.image);
      } else {
        const res: AxiosResponse<FileMetadata> = await FileApi.create(FileType.IMAGE, img);
        await this.updateCast(res.data.id);
      }
    } catch (e) {
      this.showErrorSnackbar('Upload Failed!', e.response?.status);
    } finally {
      this.loading = false;
    }
  }

  async onRemove(): Promise<void> {
    this.loading = true;
    try {
      const fileId: string = this.src;
      await this.updateCast('');
      await FileApi.delete(FileType.IMAGE, fileId);
      this.imageChange('');
    } catch (e) {
      this.showErrorSnackbar('Remove Failed!', e.response?.status);
    } finally {
      this.loading = false;
    }
  }

  private async updateCast(image: string) {
    try {
      await CastApi.update(
        this.cast.id,
        { ...this.cast, image },
      );
      this.imageChange(image);
    } catch (e) {
      await FileApi.delete(FileType.IMAGE, image);
      this.showErrorSnackbar('Upload Failed!', e.response?.status);
    }
  }
}
</script>
