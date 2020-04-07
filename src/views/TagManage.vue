<template>
  <v-row justify="center">
    <v-col md="10" lg="8">
      <v-card>
        <v-card-text>
          <div class="d-flex align-center">
            <v-text-field
              single-line
              v-model="filter"
              append-icon="search"
              name="filter"
              placeholder="Filter tags"
            >
            </v-text-field>
            <v-spacer class="d-none d-sm-block"></v-spacer>
            <v-dialog
              @click:outside="closeCreateDialog()"
              max-width="300px"
              v-model="createDialog"
            >
              <template v-slot:activator="{ on }">
                <v-btn text class="ml-4 ml-sm-0" v-on="on">
                  <v-icon class="d-none d-sm-block">add</v-icon>
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
          </div>
          <div class="mt-5 mt-md-8">
            <div class="d-flex justify-center" v-if="loading">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>

            <div class="text-center" v-show="!loading && filteredTag.length  === 0">
              <span class="body-1">No tags found</span>
            </div>

            <div>
              <v-chip
                v-for="tag of filteredTag"
                v-bind:key="tag.name"
                class="my-1 mx-1 mx-md-2"
                @click.stop="openUpdateDialog(tag)"
              >
                <v-icon left>label</v-icon>
                {{ tag.name }}
              </v-chip>

              <v-dialog v-model="updateDialog" max-width="300px">
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
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tag from '@/models/tag';
import TagForm from '@/components/TagForm.vue';

@Component({
  components: { TagForm },
})
export default class TagManage extends Vue {
  tags: Tag[] = [];
  loading = false;
  createDialog = false;
  updateDialog = false;
  updateDialogTag: Tag | null = null;
  filter = '';

  $refs!: {
    createForm: TagForm;
  };

  created() {
    this.fetchTags();
  }

  get filteredTag(): Tag[] {
    const filterReg = new RegExp(this.filter, 'i');
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

  onCreated() {
    this.closeCreateDialog();
    this.fetchTags();
  }

  closeCreateDialog() {
    this.createDialog = false;
    (this.$refs.createForm.$refs.observer as any).reset();
  }

  private async fetchTags(): Promise<void> {
    this.loading = true;
    this.tags = (await this.$axios.get<Tag[]>('/api/tags/all')).data;
    this.loading = false;
  }
}
</script>
