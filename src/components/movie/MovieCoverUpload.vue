<template>
  <base-image-picker
    :default-image="src | mediaSource('images')"
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
import FileMetadata from '@/models/file-metadata';
import { mixins } from 'vue-class-component';
import NotifySnackbarMixin from '@/mixins/notify-snackbar-mixin';
import BaseImagePicker from '@/components/BaseImagePicker.vue';
import FileApi, { FileType } from '@/api/file-api';
import MovieApi from '@/api/movie-api';

@Component({
  components: { BaseImagePicker },
})
export default class MovieCoverUpload extends mixins(NotifySnackbarMixin) {
  @Prop() movie!: Movie;
  loading = false;

  get src(): string {
    return this.movie?.cover || '';
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
        await FileApi.update(FileType.IMAGE, this.movie.cover, img);
        this.imageChange(this.movie.cover);
      } else {
        const res: AxiosResponse<FileMetadata> = await FileApi.create(FileType.IMAGE, img);
        await this.updateMovie(res.data.id);
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
      await this.updateMovie('');
      await FileApi.delete(FileType.IMAGE, fileId);
      this.imageChange('');
    } catch (e) {
      this.showErrorSnackbar('Remove Failed!', e.response?.status);
    } finally {
      this.loading = false;
    }
  }

  private async updateMovie(cover: string) {
    try {
      await MovieApi.update(
        this.movie.id,
        { ...this.movie, cover },
      );
      this.imageChange(cover);
    } catch (e) {
      if (cover && this.$options.filters?.mediaSource) {
        await FileApi.delete(FileType.IMAGE, cover);
        this.showErrorSnackbar('Upload Failed!', e.response?.status);
      }
    }
  }
}

</script>
