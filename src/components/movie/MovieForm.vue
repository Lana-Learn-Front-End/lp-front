<template>
  <validation-observer ref="observer" v-slot="{ valid }">
    <validation-provider
      v-slot="{ errors }"
      rules="required|codeFormat"
      name="code"
    >
      <v-text-field
        label="Code"
        name="code"
        v-model="form.code"
        :error-messages="errors"
      >
      </v-text-field>
    </validation-provider>
    <validation-provider
      v-slot="{ errors }"
      rules="required"
      name="name"
    >
      <v-textarea
        label="Name"
        v-model="form.name"
        :error-messages="errors"
        rows="2"
        auto-grow
      >
      </v-textarea>
    </validation-provider>
    <v-select
      label="Casts"
      v-model="form.casts"
      :items="casts"
      chips
      item-text="name"
      return-object
      multiple
    >
    </v-select>
    <v-select
      label="Tags"
      v-model="form.tags"
      :items="tags"
      chips
      item-text="name"
      return-object
      multiple
    >
    </v-select>
    <v-select
      label="Categories"
      v-model="form.categories"
      :items="categories"
      chips
      item-text="name"
      return-object
      multiple
    >
    </v-select>
    <div class="d-flex mt-5">
      <v-spacer></v-spacer>
      <slot name="actions"></slot>
      <v-btn
        text
        class="error--text"
        v-if="edit && enableDelete"
        @click="onDelete()"
        :disabled="loading"
        :loading="loading"
      >
        Delete
      </v-btn>
      <v-btn
        text
        v-if="edit"
        @click="onUpdate()"
        :disabled="!valid && loading"
        :loading="loading"
      >
        Update
      </v-btn>
      <v-btn
        text
        v-if="!edit"
        @click="onCreate()"
        :disabled="!valid && loading"
        :loading="loading"
      >
        Create
      </v-btn>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { ValidationObserver } from 'vee-validate';
import Cast from '@/models/cast';
import Tag from '@/models/tag';
import { AxiosError, AxiosResponse } from 'axios';
import Movie from '@/models/movie';
import Category from '@/models/category';

@Component
export default class MovieForm extends Vue {
  @Prop() edit?: Movie;
  @Prop({ type: Boolean }) enableDelete!: boolean;

  form!: MovieFormData;
  casts: Cast[] = [];
  tags: Tag[] = [];
  categories: Category[] = [];
  loading = false;

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  data() {
    return {
      form: undefined,
    };
  }

  async created() {
    this.casts = (await this.$axios.get<Cast[]>('/api/casts/all')).data;
    this.tags = (await this.$axios.get<Tag[]>('/api/tags/all')).data;
    this.categories = (await this.$axios.get<Tag[]>('/api/categories/all')).data;
  }

  @Watch('edit', { immediate: true })
  movieChanged(movie?: Movie) {
    if (movie) {
      this.form = getFormDataFromMovie(movie);
    } else {
      this.form = getDefaultFormData();
    }
  }

  @Emit()
  create(movie: Movie): Movie {
    this.showSnackbar('Movie created!');
    return movie;
  }

  @Emit()
  update(movie: Movie): Movie {
    this.showSnackbar('Movie updated!');
    return movie;
  }

  @Emit()
  delete(movie: Movie): Movie {
    this.showSnackbar('Movie deleted!');
    return movie;
  }

  async onDelete() {
    if (!await this.$modal.confirm('Are you sure?')) {
      return;
    }
    if (this.edit) {
      this.$axios
        .delete(`/api/movies/${this.edit.id}`)
        .then(() => this.delete(this.edit as Movie));
    }
  }

  async onCreate() {
    if (await this.isFormValid()) {
      this.form.name = this.$options.filters?.capitalize(this.form.name);
      this.form.code = uppercaseCode(this.form.code);
      this.loading = true;

      this.$axios
        .post<Movie>('/api/movies', this.form)
        .then((res: AxiosResponse) => this.create(res.data))
        .catch((err: AxiosError) => {
          if (err.response) {
            if (err.response.status === 409) {
              this.$refs.observer.setErrors({
                code: 'The code already existed',
              });
            } else {
              this.showErrorSnackbar('Cannot create new movie', err);
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  async onUpdate() {
    if (this.edit && await this.isFormValid()) {
      this.form.name = this.$options.filters?.capitalize(this.form.name);
      this.form.code = uppercaseCode(this.form.code);

      this.loading = true;
      this.$axios
        .put<Movie>(`/api/movies/${this.edit.id}`, this.form)
        .then((res: AxiosResponse) => this.update(res.data))
        .catch((e: AxiosError) => this.showErrorSnackbar('Movie update failed', e))
        .finally(() => {
          this.loading = false;
        });
    }
  }

  private async isFormValid(): Promise<boolean> {
    await this.$refs.observer.validate();
    return Object.values(this.$refs.observer.fields).every((field) => field.valid);
  }

  private showErrorSnackbar(message: string, error?: AxiosError) {
    if (error?.response) {
      this.$snackbar.showError({
        message,
        code: error.response.status,
      });
    } else {
      this.$snackbar.show({
        message,
      });
    }
  }

  private showSnackbar(message: string) {
    this.$snackbar.show({
      message,
    });
  }

  reset() {
    this.$refs.observer.reset();
    this.form = getDefaultFormData();
  }
}

interface MovieFormData {
  code: string;
  name: string;
  tags: Tag[];
  casts: Cast[];
  categories: Category[];
}

function getFormDataFromMovie(movie: Movie): MovieFormData {
  return {
    code: movie.code,
    name: movie.name,
    tags: movie.tags,
    casts: movie.casts,
    categories: movie.categories,
  };
}

function getDefaultFormData(): MovieFormData {
  return {
    code: '',
    name: '',
    tags: [],
    casts: [],
    categories: [],
  };
}

function uppercaseCode(code: string): string {
  return code
    .split('-')
    .map((part: string) => part.toUpperCase())
    .join('-');
}
</script>
