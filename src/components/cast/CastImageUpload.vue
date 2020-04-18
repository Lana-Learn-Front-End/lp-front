<template>
  <base-image-picker
    :default-image="src | image"
    :loading="loading"
    :aspect-ratio="1"
    icon="person"
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
import CastsModule, { getCastsStore } from '@/store/casts';


@Component({
  components: { BaseImagePicker },
})
export default class CastCoverUpload extends mixins(NotifySnackbarMixin) {
  @Prop() cast!: Cast;
  loading = false;
  private castsStore: CastsModule = getCastsStore();

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
        await this.removeImage(this.src);
        this.showSnackbar('Uploading new image...', { timeout: 0 });
      }
      const res: AxiosResponse<FileMetadata> = await FileApi.create(FileType.IMAGE, img);
      await this.updateCast(res.data.id);
      this.imageChange(res.data.id);
    } catch (e) {
      this.showErrorSnackbar('Upload Failed!', e.response?.status);
    } finally {
      this.loading = false;
    }
  }

  async onRemove(): Promise<void> {
    this.loading = true;
    try {
      await this.removeImage(this.src);
      this.imageChange('');
    } catch (e) {
      this.showErrorSnackbar('Remove Failed!', e.response?.status);
    } finally {
      this.loading = false;
    }
  }

  private async removeImage(image: string) {
    await this.updateCast('');
    await FileApi.delete(FileType.IMAGE, image);
  }

  private async updateCast(image: string) {
    try {
      await this.castsStore.updateCast({
        id: this.cast.id,
        cast: { ...this.cast, image },
      });
    } catch (e) {
      await FileApi.delete(FileType.IMAGE, image);
      this.showErrorSnackbar('Upload Failed!', e.response?.status);
    }
  }
}
</script>
