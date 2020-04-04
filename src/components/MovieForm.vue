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
      <v-btn text @click="onSubmit()" :disabled="!valid">Submit</v-btn>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { ValidationObserver } from 'vee-validate';
import Cast from '@/models/cast';
import Tag from '@/models/tag';
import { AxiosResponse } from 'axios';
import Movie from '@/models/movie';

@Component
export default class MovieForm extends Vue {
  @Prop({ default: '' }) url!: string;
  @Prop({ default: 'POST' }) type!: 'POST' | 'PUT';
  @Prop({ default: null }) movie?: Movie;

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  form!: MovieFormData;
  casts: Cast[] = [];
  tags: Tag[] = [];

  data() {
    return {
      form: undefined,
    };
  }

  @Watch('movie', { immediate: true })
  movieChanged(newVal: Movie) {
    this.form = getFormDataFromMovie(newVal);
  }

  @Emit()
  success(newMovie: Movie): Movie {
    return newMovie;
  }

  @Emit()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  failed(): void {
  }

  async created(): Promise<void> {
    this.casts = (await this.$axios.get<Cast[]>('/api/tags/all')).data;
    this.tags = (await this.$axios.get<Tag[]>('/api/tags/all')).data;
  }

  async onSubmit(): Promise<void> {
    await this.$refs.observer.validate();
    this.form.name = capitalize(this.form.name);
    this.form.code = uppercaseCode(this.form.code);

    try {
      const res: AxiosResponse<Movie> = this.type === 'PUT'
        ? await this.$axios.put<Movie>(this.url, this.form)
        : await this.$axios.post<Movie>(this.url, this.form);
      this.success(res.data);
    } catch (error) {
      const res: AxiosResponse | undefined = error.response;
      if (res && res.status === 409) {
        this.$refs.observer.setErrors({
          code: 'The code already existed',
        });
      }
      this.failed();
    }
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

function capitalize(str: string): string {
  return str
    .trim()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function uppercaseCode(code: string): string {
  return code
    .split('-')
    .map((part: string) => part.toUpperCase())
    .join('-');
}
</script>
