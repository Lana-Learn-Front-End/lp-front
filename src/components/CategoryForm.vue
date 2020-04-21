<template>
  <validation-observer ref="observer" v-slot="{ valid }">
    <validation-provider
      v-slot="{ errors }"
      name="name"
      rules="required"
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
        @click.stop="onDelete()"
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
import { Component, Emit, Prop, Ref, Watch } from 'vue-property-decorator';
import Category from '@/models/category';
import { ValidationObserver } from 'vee-validate';
import { mixins } from 'vue-class-component';
import NotifySnackbarMixin from '@/mixins/notify-snackbar-mixin';
import { AxiosError } from '@/api/axios';
import CategoriesModule, { getCategoriesStore } from '@/store/categories';

@Component
export default class CategoryForm extends mixins(NotifySnackbarMixin) {
  @Prop() edit?: Category;
  @Prop({ type: Boolean }) enableDelete!: boolean;
  loading = false;
  name = '';
  private categoriesStore: CategoriesModule = getCategoriesStore();

  @Ref() readonly observer!: InstanceType<typeof ValidationObserver>;

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

  async onDelete() {
    if (!await this.$modal.confirm('Are you sure?')) {
      return;
    }
    if (this.edit) {
      await this.categoriesStore
        .removeCategory(this.edit.id)
        .then(() => this.delete(this.edit as Category))
        .catch((e: AxiosError) => {
          this.showErrorSnackbar('Category delete failed', e.response?.status);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  async onCreate() {
    if (await this.isFormValid()) {
      this.name = this.$options.filters?.capitalize(this.name);
      this.loading = true;

      await this.categoriesStore
        .addCategory({ name: this.name })
        .then((category) => this.create(category))
        .catch((e: AxiosError) => {
          if (e.response && e.response.status === 409) {
            this.observer.setErrors({
              name: 'The name already existed',
            });
          } else {
            this.showErrorSnackbar('Category create failed!', e.response?.status);
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

      await this.categoriesStore
        .updateCategory({
          id: this.edit.id,
          category: { ...this.edit, name: this.name },
        })
        .then((category) => this.update(category))
        .catch((e: AxiosError) => {
          this.showErrorSnackbar('Category update failed!', e.response?.status);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  private async isFormValid(): Promise<boolean> {
    await this.observer.validate();
    return Object.values(this.observer.fields).every((field) => field.valid);
  }

  reset() {
    this.name = '';
    this.observer.reset();
  }
}
</script>
