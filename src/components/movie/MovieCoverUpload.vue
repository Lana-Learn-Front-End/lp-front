<template>
  <div class="img-container elevation-2">
    <v-img v-if="src" :src="src"></v-img>

    <base-placeholder-image v-if="!src" :aspect-ratio="800/540"></base-placeholder-image>

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
        @click="onRemove()"
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
        @click="onUpload()">
        <v-icon>cloud_upload</v-icon>
      </v-btn>
      <v-btn
        fab
        small
        class="ml-2 error--text"
        @click="setImgToDefault(movie)"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Movie from '@/models/movie';
import { AxiosError, AxiosResponse } from 'axios';
import { default as Cover } from '@/models/file';
import BasePlaceholderImage from '@/components/BasePlaceholderImage.vue';

@Component({
  components: { BasePlaceholderImage },
})
export default class MovieCoverUpload extends Vue {
  @Prop() movie!: Movie;
  loading = false;
  img?: File;
  src!: string;

  $refs!: {
    file: HTMLInputElement;
  };

  data() {
    return {
      img: undefined,
      src: '',
    };
  }

  @Watch('movie', { immediate: true })
  onMovieChange(movie: Movie) {
    this.setImgToDefault(movie);
  }

  onImgPicked(files: FileList) {
    if (files.length > 0) {
      [this.img] = files;
      this.src = URL.createObjectURL(this.img);
    }
  }

  setImgToDefault(movie: Movie) {
    if (movie.cover) {
      this.src = `http://localhost:8080/data/images/${movie.cover}`;
    } else {
      this.src = '';
    }
    this.img = undefined;
  }

  async onUpload(): Promise<void> {
    if (this.img) {
      this.loading = true;
      try {
        if (this.movie.cover) {
          await this.updateExistedImage(this.img);
        } else {
          await this.uploadImage(this.img);
        }
        this.showSnackbar('Upload Success');
      } catch (e) {
        this.showErrorSnackbar('Upload Failed!', e);
      } finally {
        this.loading = false;
        this.setImgToDefault(this.movie);
      }
    }
  }

  async onRemove(): Promise<void> {
    this.loading = true;
    try {
      await this.updateMovie('');
      await this.$axios.delete(this.src);
      this.showSnackbar('Remove Success!');
    } catch (e) {
      this.showErrorSnackbar('Remove Failed!', e);
    } finally {
      this.loading = false;
      this.setImgToDefault(this.movie);
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

  private async updateExistedImage(img: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', img);
    await this.$axios.put(`/data/images/${this.movie.cover}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  private async updateMovie(cover: string) {
    try {
      this.movie.cover = cover;
      this.$axios.put(
        `/api/movies/${this.movie.id}`,
        this.movie,
      );
    } catch (e) {
      if (cover) {
        this.$axios.delete(`/data/images/${cover}`);
      }
    }
  }

  private showErrorSnackbar(message: string, error?: AxiosError) {
    if (error?.response) {
      this.$store.commit('snackbar/showError', {
        message,
        code: error.response.status,
      });
    } else {
      this.$store.commit('snackbar/showError', {
        message,
      });
    }
  }

  private showSnackbar(message: string) {
    this.$store.commit('snackbar/show', {
      message,
    });
  }
}
</script>

<style scoped>
  .img-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .img-btn {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
</style>
