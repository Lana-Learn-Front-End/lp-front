<template>
  <base-image-picker
    :default-image="src"
    :loading="loading"
    :aspect-ratio="800/540"
    @upload="onUpload($event)"
    @remove="onRemove()"
  >
  </base-image-picker>
</template>

<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator';
import Movie from '@/models/movie';
import { AxiosResponse } from 'axios';
import { default as Cover } from '@/models/file';
import { mixins } from 'vue-class-component';
import NotifySnackbarMixin from '@/mixins/notify-snackbar-mixin';
import BaseImagePicker from '@/components/BaseImagePicker.vue';

@Component({
  components: { BaseImagePicker },
})
export default class MovieCoverUpload extends mixins(NotifySnackbarMixin) {
  @Prop() movie!: Movie;
  loading = false;

  get src(): string {
    return this.$options.filters?.mediaSource(this.movie?.cover, 'images') || '';
  }

  @Emit()
  imageChange(src: string): string {
    this.showSnackbar('Image changed successfully!');
    return src;
  }

  async onUpload(img: File): Promise<void> {
    this.loading = true;
    try {
      if (this.movie.cover) {
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
      await this.updateMovie('');
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
    await this.updateMovie(res.data.id);
  }

  private async updateMovie(cover: string) {
    try {
      this.movie.cover = cover;
      await this.$axios.put(
        `/api/movies/${this.movie.id}`,
        this.movie,
      );
      this.imageChange(cover);
    } catch (e) {
      if (cover && this.$options.filters?.mediaSource) {
        await this.$axios.delete(this.$options.filters?.mediaSource(cover, 'images'));
        this.showErrorSnackbar('Upload Failed!', e.response?.status);
      }
    }
  }

  private async updateExistedImage(img: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', img);
    await this.$axios.put(`/data/images/${this.movie.cover}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    this.imageChange(this.movie.cover);
  }
}

</script>
