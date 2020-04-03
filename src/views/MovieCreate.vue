<template>
  <v-row justify="center">
    <v-col xl="4" lg="5" md="7" sm="9" cols="11">
      <v-card>
        <v-card-title>New Movie</v-card-title>
        <v-card-text>
          <movie-form type="POST" url="/api/movies"></movie-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MovieForm from '@/components/MovieForm.vue';

@Component({
  components: { MovieForm },
})
export default class MovieCreate extends Vue {
}
</script>
