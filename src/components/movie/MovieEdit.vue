<template>
  <v-sheet class="bg-dark h-100">
    <v-app-bar fixed>
      <v-toolbar-title>Edit Movie</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="onComplete()">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <base-content-wrapper>
        <v-card v-if="movie" class="w-100">
          <v-card-title
            :class="{
              'title': $vuetify.breakpoint.mdAndUp,
              'subtitle-1 font-weight-bold': $vuetify.breakpoint.smAndDown
            }"
          >
            [{{movie.code}}] {{movie.name}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="7" lg="6" class="px-3 px-md-5 px-lg-8">
                <movie-cover-upload
                  :movie="movie"
                  @image-change="onImageChange($event)"
                >
                </movie-cover-upload>
              </v-col>
              <v-col>
                <movie-form
                  :edit="movie"
                  @update="onUpdate($event)"
                  @delete="onDelete()"
                  enable-delete
                >
                  <template v-slot:actions>
                    <v-btn class="mr-2" text @click="onComplete()">Done</v-btn>
                  </template>
                </movie-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </base-content-wrapper>
    </v-content>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import Movie from '@/models/movie';
import MovieCoverUpload from '@/components/movie/MovieCoverUpload.vue';
import MovieForm from '@/components/movie/MovieForm.vue';
import BaseContentWrapper from '@/components/BaseContentWrapper.vue';

@Component({
  components: { BaseContentWrapper, MovieCoverUpload, MovieForm },
})
export default class MovieEdit extends Vue {
  @Prop() movie!: Movie;

  onImageChange(src: string) {
    this.onUpdate({ ...this.movie, cover: src });
  }

  @Emit('update')
  onUpdate(movie: Movie): Movie {
    return movie;
  }

  @Emit('delete')
  onDelete(): Movie {
    return this.movie;
  }

  @Emit('complete')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onComplete(): void {
  }
}
</script>

<style scoped>
  .bg-dark {
    background: #121212;
    color: #fff;
  }
</style>
