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
        v-model="form.name"
        :error-messages="errors"
      >
      </v-text-field>
    </validation-provider>
    <validation-provider
      v-slot="{ errors }"
      name="birth"
      rules="date"
    >
      <v-text-field
        v-model="form.birth"
        label="Date of Birth"
        hint="Format: YYYY-MM-DD"
        :error-messages="errors"
      >
        <template v-slot:append>
          <v-menu
            left
            v-model="datepickerMenu"
            :close-on-content-click="false"
            :nudge-left="40"
            transition="scale-transition"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" :disabled="errors.length > 0">
                <v-icon>event</v-icon>
              </v-btn>
            </template>
            <v-date-picker
              format
              no-title
              v-model="form.birth"
              @input="datepickerMenu = false"
            >
            </v-date-picker>
          </v-menu>
        </template>
      </v-text-field>
    </validation-provider>
    <div class="d-flex mt-3">
      <v-spacer></v-spacer>
      <slot name="actions"></slot>
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
import Cast from '@/models/cast';
import { ValidationObserver } from 'vee-validate';
import { mixins } from 'vue-class-component';
import NotifySnackbarMixin from '@/mixins/notify-snackbar-mixin';
import { AxiosError } from '@/api/axios';
import CastsModule, { getCastsStore } from '@/store/casts';

@Component
export default class CastForm extends mixins(NotifySnackbarMixin) {
  @Prop() edit?: Cast;
  @Prop({ type: Boolean }) enableDelete!: boolean;

  datepickerMenu = false;
  form!: CastFormData;
  loading = false;

  private castsStore: CastsModule = getCastsStore();

  @Ref() readonly observer!: InstanceType<typeof ValidationObserver>;

  data() {
    return {
      form: undefined,
    };
  }

  @Watch('edit', { immediate: true })
  castChanged(cast?: Cast) {
    if (cast) {
      this.form = {
        name: cast.name,
        birth: cast.birth,
      };
    } else {
      this.form = getDefaultFormData();
    }
  }

  @Emit()
  create(cast: Cast): Cast {
    this.showSnackbar('Cast created!');
    return cast;
  }

  @Emit()
  update(cast: Cast): Cast {
    this.showSnackbar('Cast updated!');
    return cast;
  }

  @Emit()
  delete(cast: Cast): Cast {
    this.showSnackbar('Cast deleted!');
    return cast;
  }

  async onDelete() {
    if (!await this.$modal.confirm('Are you sure?')) {
      return;
    }
    if (this.edit) {
      this.loading = true;
      await this.castsStore
        .removeCast(this.edit.id)
        .then(() => this.delete(this.edit as Cast))
        .catch((e: AxiosError) => {
          this.showErrorSnackbar('Cast delete failed', e.response?.status);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  async onCreate() {
    if (await this.isFormValid()) {
      this.form.name = this.$options.filters?.capitalize(this.form.name);
      this.loading = true;

      await this.castsStore
        .addCast(this.form)
        .then((cast) => this.create(cast))
        .catch((e: AxiosError) => {
          if (e.response) {
            if (e.response.status === 409) {
              this.observer.setErrors({
                name: 'The cast name already existed',
              });
            } else {
              this.showErrorSnackbar('Cannot create new cast', e.response?.status);
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

      this.loading = true;
      await this.castsStore
        .updateCast({
          id: this.edit.id,
          cast: { ...this.edit, ...this.form },
        })
        .then((cast) => this.update(cast))
        .catch((e: AxiosError) => {
          this.showErrorSnackbar('Cast update failed', e.response?.status);
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
    this.observer.reset();
    this.form = getDefaultFormData();
  }
}

function getDefaultFormData(): CastFormData {
  return {
    name: '',
    birth: '',
  };
}

interface CastFormData {
  name: string;
  birth: string;
}
</script>
