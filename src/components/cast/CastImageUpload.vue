<template>
  <base-image-picker
    :default-image="src"
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
import { AxiosResponse } from 'axios';
import { default as Cover } from '@/models/file';
import { mixins } from 'vue-class-component';
import NotifySnackbarMixin from '@/mixins/notify-snackbar-mixin';
import BaseImagePicker from '@/components/BaseImagePicker.vue';

@Component({
  components: { BaseImagePicker },
})
export default class CastCoverUpload extends mixins(NotifySnackbarMixin) {
  @Prop() cast!: Cast;
  loading = false;

  get src(): string {
    return this.$options.filters?.mediaSource(this.cast?.image, 'images') || '';
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
        await this.updateExistedImage(img);
      } else {
        await this.uploadImage(img);
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
      const deleteUrl: string = this.src;
      await this.updateCast('');
      await this.$axios.delete(deleteUrl);
      this.imageChange('');
    } catch (e) {
      this.showErrorSnackbar('Remove Failed!', e.response?.status);
    } finally {
      this.loading = false;
    }
  }

  private async uploadImage(img: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', img);
    const res: AxiosResponse<Cover> = await this.$axios.post('/data/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    await this.updateCast(res.data.id);
  }

  private async updateCast(image: string) {
    try {
      this.cast.image = image;
      await this.$axios.put(
        `/api/casts/${this.cast.id}`,
        this.cast,
      );
      this.imageChange(image);
    } catch (e) {
      if (image && this.$options.filters?.mediaSource) {
        await this.$axios.delete(this.$options.filters?.mediaSource(image, 'images'));
        this.showErrorSnackbar('Upload Failed!', e.response?.status);
      }
    }
  }

  private async updateExistedImage(img: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', img);
    await this.$axios.put(`/data/images/${this.cast.image}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    this.imageChange(this.cast.image);
  }
}
</script>
