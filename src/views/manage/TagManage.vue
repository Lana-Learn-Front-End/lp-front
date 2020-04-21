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
          :value="search"
          @input="onSearch($event)"
          append-icon="search"
          name="search"
          placeholder="Search tags"
        >
        </v-text-field>
        <v-spacer class="d-none d-sm-block"></v-spacer>
      </div>
      <div class="mb-2 mb-md-4">
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-overlay>

        <div class="text-center" v-show="!loading && filteredTags.length === 0">
          <span class="body-1">No tags found</span>
        </div>

        <div>
          <v-row
            v-for="(group, key) in filteredTagGroups"
            :key="key"
          >
            <v-col cols="12">
              <h2 class="text--primary my-2">{{ key }}</h2>
              <v-divider></v-divider>
            </v-col>
            <v-col
              v-for="tag of group"
              :key="tag.id"
              xs="6"
              sm="4"
              md="3"
              lg="2"
            >
              <v-chip
                class="mx-md-2"
                @click.stop="openUpdateDialog(tag)"
              >
                {{ tag.name }}
              </v-chip>
            </v-col>
          </v-row>

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
import { Component, Ref, Vue } from 'vue-property-decorator';
import Tag from '@/models/tag';
import TagForm from '@/components/TagForm.vue';
import TagsModule, { getTagsStore } from '@/store/tags';
import { Debounce } from '@/core/decorators';

@Component({
  components: { TagForm },
})
export default class TagManage extends Vue {
  loading = false;
  createDialog = false;
  updateDialog = false;
  updateDialogTag: Tag | null = null;
  search = '';

  private tagStore: TagsModule = getTagsStore();

  @Ref() readonly createForm!: TagForm & { reset(): void };

  async created() {
    this.loading = true;
    await this.tagStore.fetchTags();
    this.loading = false;
  }

  @Debounce(350)
  onSearch(keyword: string) {
    this.search = keyword;
  }

  get filteredTags(): Tag[] {
    const filterReg = new RegExp(this.search, 'i');
    return this.tagStore.tags.filter(
      (tag: Tag) => filterReg.test(tag.name),
    );
  }

  get filteredTagGroups(): { [key: string]: Tag[] } {
    return this.filteredTags
      .reduce((groups: any, tag: Tag) => {
        if (!groups[tag.name.charAt(0)]) {
          groups[tag.name.charAt(0)] = [tag];
        } else {
          groups[tag.name.charAt(0)].push(tag);
        }
        return groups;
      }, {});
  }

  onUpdatedOrDeleted() {
    this.updateDialog = false;
    this.updateDialogTag = null;
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
  }

  closeCreateDialog() {
    this.createDialog = false;
    this.createForm.reset();
  }
}
</script>
