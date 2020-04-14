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
          v-model.trim="search"
          append-icon="search"
          name="filter"
          placeholder="Filter casts"
          @keyup.enter="onSearch()"
        >
        </v-text-field>
        <v-spacer class="d-none d-sm-block"></v-spacer>
      </div>

      <div class="mt-5 mt-md-8">
        <div class="text-center" v-show="!loading && casts.length  === 0">
          <span class="body-1">No casts found</span>
        </div>

        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-overlay>

        <v-row>
          <v-col
            v-for="cast of casts"
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
                  :src="cast.image | mediaSource('images')"
                  :aspect-ratio="1"
                >
                </v-img>
                <base-placeholder-image
                  v-if="!cast.image"
                  :aspect-ratio="1"
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
                @update="onCastUpdate($event)"
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
        :length="totalPages"
      >
      </v-pagination>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CastForm from '@/components/cast/CastForm.vue';
import Cast from '@/models/cast';
import BasePlaceholderImage from '@/components/BasePlaceholderImage.vue';
import Page from '@/models/util/page';
import { AxiosResponse } from 'axios';
import CastEdit from '@/components/cast/CastEdit.vue';

@Component({
  components: { BasePlaceholderImage, CastForm, CastEdit },
})
export default class CastManage extends Vue {
  casts: Cast[] = [];

  createDialog = false;
  updateDialog = false;
  updateDialogCast: Cast | null = null;

  loading = false;
  page = 1;
  totalPages = 1;
  search = '';

  $refs!: {
    createForm: CastForm & { reset(): void };
  };

  created() {
    this.fetchCasts();
  }

  @Watch('page')
  pageChange() {
    this.fetchCasts();
  }

  onSearch() {
    if (this.page === 1) {
      this.fetchCasts();
    } else {
      // page change will trigger fetch.
      this.page = 1;
    }
  }

  onCastUpdate(cast: Cast) {
    Object.assign(this.updateDialogCast, cast);
  }

  async onCastDelete() {
    this.closeUpdateDialog();
    await this.fetchCasts();
  }

  async onCastCreated(cast: Cast) {
    this.closeCreateDialog();
    await this.fetchCasts();
    this.openUpdateDialog(this.casts.find((m: Cast) => m.id === cast.id) || cast);
  }

  openUpdateDialog(cast: Cast) {
    this.updateDialogCast = cast;
    this.updateDialog = true;
  }

  closeUpdateDialog() {
    this.updateDialogCast = null;
    this.updateDialog = false;
  }

  closeCreateDialog() {
    this.createDialog = false;
    this.$refs.createForm.reset();
  }

  async fetchCasts(): Promise<void> {
    this.loading = true;
    await this.$axios
      .get('/api/casts', {
        params: {
          page: this.page,
          size: 30,
          q: this.search ? `name=ilike=${this.search}` : '',
        },
      })
      .then((res: AxiosResponse<Page<Cast>>) => res.data)
      .then((castPage: Page<Cast>) => {
        this.casts = castPage.content;
        this.totalPages = castPage.totalPages;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
