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
import Category from '@/models/category';
import { ValidationObserver } from 'vee-validate';
import { AxiosError, AxiosResponse } from 'axios';
import Movie from '@/models/movie';

@Component
export default class CategoryForm extends Vue {
  @Prop() edit?: Category;
  @Prop({ type: Boolean }) enableDelete!: boolean;
  loading = false;
  name = '';
  deleteDialog = false;

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  @Watch('edit', { immediate: true })
  categoryChanged(category: Category) {
    if (category) {
      this.name = category.name || '';
    }
  }

  @Emit()
  create(category: Category): Category {
    this.showSnackbar(`Category ${category.name} updated!`);
    return category;
  }

  @Emit()
  update(category: Category): Category {
    this.showSnackbar(`Category ${category.name} updated!`);
    return category;
  }

  @Emit()
  delete(category: Category): Category {
    this.showSnackbar(`Category ${category.name} deleted!`);
    return category;
  }

  onDelete() {
    if (this.edit) {
      this.$axios
        .delete(`/api/categories/${this.edit.id}`)
        .then(() => this.delete(this.edit as Movie));
    }
  }

  async onCreate() {
    if (await this.isFormValid()) {
      this.name = this.$options.filters?.capitalize(this.name);
      this.loading = true;

      this.$axios
        .post<Category>('/api/categories', { name: this.name })
        .then((res: AxiosResponse<Category>) => this.create(res.data))
        .catch((e: AxiosError) => {
          if (e.response && e.response.status === 409) {
            this.$refs.observer.setErrors({
              name: 'The name already existed',
            });
          } else {
            this.showErrorSnackbar('Category create failed!', e);
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
        .put<Category>(`/api/categories/${this.edit.id}`, { name: this.name })
        .then((res: AxiosResponse<Category>) => this.update(res.data))
        .catch((e: AxiosError) => this.showErrorSnackbar('Category update failed!', e))
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
