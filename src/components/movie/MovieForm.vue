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
      label="Tag"
      v-model="form.tags"
      :items="tags"
      chips
      item-text="name"
      return-object
      multiple
    >
    </v-select>
    <div class="d-flex mt-5">
      <v-spacer></v-spacer>
      <v-btn
        text
        class="error--text"
        v-if="edit && enableDelete"
        @click.stop="deleteDialog = true"
        :disabled="loading"
        :loading="loading"
      >
        Delete
      </v-btn>
      <v-dialog
        v-model="deleteDialog"
        max-width="300px"
        persistent
      >
        <template v-slot:default>
          <v-card>
            <v-card-title>Are you sure?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                @click.stop="deleteDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                @click="onDelete()"
                class="error--text"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
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
import { capitalize } from '@/util/string-format';

@Component
export default class MovieForm extends Vue {
  @Prop() edit?: Movie;
  @Prop({ type: Boolean }) enableDelete!: boolean;

  form!: MovieFormData;
  casts: Cast[] = [];
  tags: Tag[] = [];
  loading = false;
  deleteDialog = false;

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  data() {
    return {
      form: undefined,
    };
  }

  @Watch('edit', { immediate: true })
  movieChanged(movie: Movie) {
    this.form = getFormDataFromMovie(movie);
  }

  @Emit()
  create(movie: Movie): Movie {
    return movie;
  }

  @Emit()
  update(movie: Movie): Movie {
    return movie;
  }

  @Emit()
  delete(movie: Movie): Movie {
    return movie;
  }

  async created() {
    this.casts = (await this.$axios.get<Cast[]>('/api/casts/all')).data;
    this.tags = (await this.$axios.get<Tag[]>('/api/tags/all')).data;
  }

  onDelete() {
    if (this.edit) {
      this.$axios
        .delete(`/api/movies/${this.edit.id}`)
        .then(() => this.delete(this.edit as Movie));
    }
  }

  async onCreate() {
    this.form.name = capitalize(this.form.name);
    this.form.code = uppercaseCode(this.form.code);

    if (await this.isFormValid()) {
      this.loading = true;
      this.$axios
        .post<Movie>('/api/movies', this.form)
        .then((res: AxiosResponse) => this.create(res.data))
        .catch((err: AxiosError) => {
          if (err.response && err.response.status === 409) {
            this.$refs.observer.setErrors({
              code: 'The code already existed',
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  async onUpdate() {
    if (this.edit) {
      this.form.name = capitalize(this.form.name);
      this.form.code = uppercaseCode(this.form.code);

      if (await this.isFormValid()) {
        this.loading = true;
        this.$axios
          .put<Movie>(`/api/movies/${this.edit.id}`, this.form)
          .then((res: AxiosResponse) => this.update(res.data))
          .finally(() => {
            this.loading = false;
          });
      }
    }
  }

  private async isFormValid(): Promise<boolean> {
    await this.$refs.observer.validate();
    return Object.values(this.$refs.observer.fields).every((field) => field.valid);
  }
}

interface MovieFormData {
  code: string;
  name: string;
  tags: Tag[];
  casts: Cast[];
}

function getFormDataFromMovie(movie: Movie | undefined | null): MovieFormData {
  if (movie) {
    return {
      code: movie.code,
      name: movie.name,
      tags: movie.tags,
      casts: movie.casts,
    };
  }
  return {
    code: '',
    name: '',
    tags: [],
    casts: [],
  };
}

function uppercaseCode(code: string): string {
  return code
    .split('-')
    .map((part: string) => part.toUpperCase())
    .join('-');
}
</script>
