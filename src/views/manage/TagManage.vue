<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      <span>Tags Management</span>
      <v-dialog
        max-width="300px"
        v-model="createDialog"
        retain-focus
        @click:outside="closeCreateDialog()"
      >
        <template v-slot:activator="{ on }">
          <v-btn text class="ml-3 ml-sm-0" v-on="on">
            <v-icon left>add</v-icon>
            <span>New</span>
          </v-btn>
        </template>

        <template v-slot:default>
          <v-card>
            <v-card-title>Create new tag</v-card-title>
            <v-card-text>
              <tag-form
                ref="createForm"
                @create="onCreated($event)"
              >
              </tag-form>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-title>
    <v-card-text>
      <div class="d-flex align-center">
        <v-text-field
          single-line
          v-model="search"
          append-icon="search"
          name="filter"
          placeholder="Filter tags"
        >
        </v-text-field>
        <v-spacer class="d-none d-sm-block"></v-spacer>
      </div>
      <div class="mt-5 mt-md-8">
        <div class="d-flex justify-center" v-if="loading">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>

        <div class="text-center" v-show="!loading && filteredTags.length  === 0">
          <span class="body-1">No tags found</span>
        </div>

        <div>
          <v-chip
            v-for="tag of filteredTags"
            v-bind:key="tag.name"
            class="my-1 mx-1 mx-md-2"
            @click.stop="openUpdateDialog(tag)"
          >
            <v-icon left>label</v-icon>
            {{ tag.name }}
          </v-chip>

          <v-dialog
            retain-focus
            v-model="updateDialog"
            max-width="300px"
            @click:outside="closeUpdateDialog()"
          >
            <template v-slot:default>
              <v-card>
                <v-card-title>Update tag</v-card-title>
                <v-card-text>
                  <tag-form
                    :edit="updateDialogTag"
                    enable-delete
                    @update="onUpdatedOrDeleted()"
                    @delete="onUpdatedOrDeleted()"
                  >
                  </tag-form>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tag from '@/models/tag';
import TagForm from '@/components/TagForm.vue';
import { AxiosResponse } from 'axios';

@Component({
  components: { TagForm },
})
export default class TagManage extends Vue {
  tags: Tag[] = [];
  loading = false;
  createDialog = false;
  updateDialog = false;
  updateDialogTag: Tag | null = null;
  search = '';

  $refs!: {
    createForm: TagForm & { reset(): void };
  };

  created() {
    this.fetchTags();
  }

  get filteredTags(): Tag[] {
    const filterReg = new RegExp(this.search, 'i');
    return this.tags.filter(
      (tag: Tag) => filterReg.test(tag.name),
    );
  }

  onUpdatedOrDeleted() {
    this.updateDialog = false;
    this.updateDialogTag = null;
    this.fetchTags();
  }

  openUpdateDialog(tag: Tag) {
    this.updateDialogTag = tag;
    this.updateDialog = true;
  }

  closeUpdateDialog() {
    this.updateDialog = false;
    this.updateDialogTag = null;
  }

  onCreated() {
    this.closeCreateDialog();
    this.fetchTags();
  }

  closeCreateDialog() {
    this.createDialog = false;
    this.$refs.createForm.reset();
  }

  private fetchTags() {
    this.loading = true;
    this.$axios
      .get<Tag[]>('/api/tags/all')
      .then((res: AxiosResponse<Tag[]>) => {
        this.tags = res.data;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
