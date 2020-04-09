<template>
  <validation-observer ref="observer" v-slot="{ valid }">
    <validation-provider
      v-slot="{ errors }"
      name="name"
      rules="required"
      autofocus
    >
      <v-text-field
        label="Name"
        name="name"
        v-model="name"
        :error-messages="errors"
      >
      </v-text-field>
    </validation-provider>
    <div class="d-flex mt-3">
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
            <v-card-title>
              Are you sure
            </v-card-title>
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
                class="error--text"
                @click="onDelete()"
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
import Tag from '@/models/tag';
import { ValidationObserver } from 'vee-validate';
import { AxiosError, AxiosResponse } from 'axios';
import Movie from '@/models/movie';

@Component
export default class TagForm extends Vue {
  @Prop() edit?: Tag;
  @Prop({ type: Boolean }) enableDelete!: boolean;
  loading = false;
  name = '';
  deleteDialog = false;

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  @Watch('edit', { immediate: true })
  tagChanged(tag: Tag) {
    if (tag) {
      this.name = tag.name || '';
    }
  }

  @Emit()
  create(tag: Tag): Tag {
    this.showSnackbar(`Tag ${tag.name} updated!`);
    return tag;
  }

  @Emit()
  update(tag: Tag): Tag {
    this.showSnackbar(`Tag ${tag.name} updated!`);
    return tag;
  }

  @Emit()
  delete(tag: Tag): Tag {
    this.showSnackbar(`Tag ${tag.name} deleted!`);
    return tag;
  }

  onDelete() {
    if (this.edit) {
      this.$axios
        .delete(`/api/tags/${this.edit.id}`)
        .then(() => this.delete(this.edit as Movie));
    }
  }

  async onCreate() {
    if (await this.isFormValid()) {
      this.name = this.$options.filters?.capitalize(this.name);
      this.loading = true;

      this.$axios
        .post<Tag>('/api/tags', { name: this.name })
        .then((res: AxiosResponse<Tag>) => this.create(res.data))
        .catch((e: AxiosError) => {
          if (e.response && e.response.status === 409) {
            this.$refs.observer.setErrors({
              name: 'The name already existed',
            });
          } else {
            this.showErrorSnackbar('Tag create failed!', e);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  async onUpdate() {
    if (this.edit && await this.isFormValid()) {
      this.name = this.$options.filters?.capitalize(this.name);
      this.loading = true;

      this.$axios
        .put<Tag>(`/api/tags/${this.edit.id}`, { name: this.name })
        .then((res: AxiosResponse<Tag>) => this.update(res.data))
        .catch((e: AxiosError) => this.showErrorSnackbar('Tag update failed!', e))
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

  reset() {
    this.name = '';
    this.$refs.observer.reset();
  }
}
</script>
