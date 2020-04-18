<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      <span>Casts Management</span>
      <v-btn
        text
        class="ml-3 ml-sm-0"
        @click.stop="createDialog = true"
      >
        <v-icon left>add</v-icon>
        <span>New</span>
      </v-btn>
      <!-- create dialog-->
      <v-dialog
        v-model="createDialog"
        max-width="500px"
        retain-focus
        @click:outside="closeCreateDialog()"
      >
        <v-card>
          <v-card-title>New Cast</v-card-title>
          <v-card-text>
            <cast-form
              ref="createForm"
              @create="onCastCreated($event)"
            >
              <template v-slot:actions>
                <v-btn
                  text
                  @click.stop="closeCreateDialog()"
                >
                  Cancel
                </v-btn>
              </template>
            </cast-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>

    <v-card-text>
      <div class="d-flex align-center">
        <v-text-field
          single-line
          v-model.lazy.trim="search"
          append-icon="search"
          name="filter"
          placeholder="Filter casts"
        >
        </v-text-field>
        <v-spacer class="d-none d-sm-block"></v-spacer>
      </div>

      <div class="mt-5 mt-md-8">
        <div class="text-center" v-show="!loading && castPage.content.length  === 0">
          <span class="body-1">No casts found</span>
        </div>

        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-overlay>

        <v-row>
          <v-col
            v-for="cast of castPage.content"
            :key="cast.id"
            cols="6"
            md="4"
            lg="2"
          >
            <v-card
              height="100%"
              @click.stop="openUpdateDialog(cast)"
            >
              <div>
                <v-img
                  v-if="cast.image"
                  :src="cast.image | image"
                  :aspect-ratio="1"
                >
                </v-img>
                <base-placeholder-image
                  v-if="!cast.image"
                  :aspect-ratio="1"
                  icon="person"
                >
                </base-placeholder-image>
              </div>
              <v-card-title class="body-1">
                <div>
                  {{ cast.name | truncate(120, true) }}
                </div>
              </v-card-title>
            </v-card>
          </v-col>
          <v-dialog
            v-model="updateDialog"
            max-width="350px"
            retain-focus
          >
            <template v-slot:default>
              <cast-edit
                :cast="updateDialogCast"
                @delete="onCastDelete()"
                @complete="closeUpdateDialog()"
              >
              </cast-edit>
            </template>
          </v-dialog>
        </v-row>
      </div>

      <v-pagination
        class="mt-5"
        v-model="page"
        :total-visible="5"
        :length="castPage.totalPages"
      >
      </v-pagination>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CastForm from '@/components/cast/CastForm.vue';
import Cast from '@/models/cast';
import BasePlaceholderImage from '@/components/BasePlaceholderImage.vue';
import CastEdit from '@/components/cast/CastEdit.vue';
import CastsModule, { getCastsStore } from '@/store/casts';
import Page from '@/models/util/page';
import { getPageFromArray } from '@/core/paginate';

@Component({
  components: { BasePlaceholderImage, CastForm, CastEdit },
})
export default class CastManage extends Vue {
  createDialog = false;
  updateDialog = false;
  updateDialogCast: Cast | null = null;

  loading = false;
  page = 1;
  search = '';

  private castsStore: CastsModule = getCastsStore();

  $refs!: {
    createForm: CastForm & { reset(): void };
  };

  created() {
    this.castsStore.fetchCasts();
  }

  async onCastDelete() {
    this.closeUpdateDialog();
  }

  async onCastCreated(cast: Cast) {
    this.closeCreateDialog();
    this.openUpdateDialog(cast);
  }

  closeCreateDialog() {
    this.createDialog = false;
    this.$refs.createForm.reset();
  }

  openUpdateDialog(cast: Cast) {
    this.updateDialogCast = cast;
    this.updateDialog = true;
  }

  closeUpdateDialog() {
    this.updateDialogCast = null;
    this.updateDialog = false;
  }

  get castPage(): Page<Cast> {
    const casts: Cast[] = this.castsStore.allCasts
      .filter((cast: Cast) => cast.name.toLowerCase().includes(this.search.toLowerCase()));
    return getPageFromArray(casts, this.page);
  }
}
</script>
