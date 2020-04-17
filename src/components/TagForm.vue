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
import { Component, Emit, Prop, Watch } from 'vue-property-decorator';
import Tag from '@/models/tag';
import { ValidationObserver } from 'vee-validate';
import { mixins } from 'vue-class-component';
import NotifySnackbarMixin from '@/mixins/notify-snackbar-mixin';
import { AxiosError } from '@/api/axios';
import TagsModule, { getTagsStore } from '@/store/tags';

@Component
export default class TagForm extends mixins(NotifySnackbarMixin) {
  @Prop() edit?: Tag;
  @Prop({ type: Boolean }) enableDelete!: boolean;
  loading = false;
  name = '';
  private tagsStore: TagsModule = getTagsStore();

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

  async onDelete() {
    if (!await this.$modal.confirm('Are you sure?')) {
      return;
    }
    if (this.edit) {
      this.loading = true;
      await this.tagsStore
        .removeTag(this.edit.id)
        .then(() => this.delete(this.edit as Tag))
        .catch((e: AxiosError) => {
          this.showErrorSnackbar('Tag delete failed', e.response?.status);
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

      await this.tagsStore
        .addTag({ name: this.name })
        .then((tag) => this.create(tag))
        .catch((e: AxiosError) => {
          if (e.response && e.response.status === 409) {
            this.$refs.observer.setErrors({
              name: 'The name already existed',
            });
          } else {
            this.showErrorSnackbar('Tag create failed!', e.response?.status);
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

      await this.tagsStore
        .updateTag({ id: this.edit.id, tag: { ...this.edit, name: this.name } })
        .then((tag) => this.update(tag))
        .catch((e: AxiosError) => {
          console.log(e);
          this.showErrorSnackbar('Tag update failed!', e.response?.status);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  private async isFormValid(): Promise<boolean> {
    await this.$refs.observer.validate();
    return Object.values(this.$refs.observer.fields).every((field) => field.valid);
  }

  reset() {
    this.name = '';
    this.$refs.observer.reset();
  }
}
</script>
