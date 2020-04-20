<template>
  <v-card v-if="cast" class="w-100">
    <v-card-title
      :class="{
        'title': $vuetify.breakpoint.mdAndUp,
        'subtitle-1 font-weight-bold': $vuetify.breakpoint.smAndDown
      }"
    >
      {{cast.name}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <cast-image-upload
        class="mt-5 mb-8"
        :cast="cast"
        @image-change="onImageChange($event)"
      >
      </cast-image-upload>
      <cast-form
        :edit="cast"
        @update="onUpdate($event)"
        @delete="onDelete()"
        enable-delete
      >
        <template v-slot:actions>
          <v-btn class="mr-2" text @click="onComplete()">Done</v-btn>
        </template>
      </cast-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import Cast from '@/models/cast';
import CastImageUpload from '@/components/cast/CastImageUpload.vue';
import CastForm from '@/components/cast/CastForm.vue';

@Component({
  components: { CastImageUpload, CastForm },
})
export default class CastEdit extends Vue {
  @Prop() cast!: Cast;

  onImageChange(src: string) {
    this.onUpdate({ ...this.cast, image: src });
  }

  @Emit('update')
  onUpdate(cast: Cast): Cast {
    return cast;
  }

  @Emit('delete')
  onDelete(): Cast {
    return this.cast;
  }

  @Emit('complete')
  onComplete(): void {
  }
}
</script>
