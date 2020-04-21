<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      <span>Categories Management</span>
      <v-dialog
        retain-focus
        max-width="300px"
        v-model="createDialog"
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
            <v-card-title>Create new category</v-card-title>
            <v-card-text>
              <category-form
                ref="createForm"
                @create="onCreated($event)"
              >
              </category-form>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-title>
    <v-card-text>
      <div class="d-flex align-center">
        <v-text-field
          single-line
          v-model.trim="search"
          append-icon="search"
          name="search"
          placeholder="Search categories"
        >
        </v-text-field>
        <v-spacer class="d-none d-sm-block"></v-spacer>
      </div>
      <div class="mb-2 mb-md-4">
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-overlay>

        <div class="text-center" v-show="!loading && filteredCategories.length  === 0">
          <span class="body-1">No categories found</span>
        </div>

        <div>
          <v-row v-for="(group, key) in filteredCategoryGroups" :key="key">
            <v-col cols="12">
              <h2 class="text--primary my-2">{{ key }}</h2>
              <v-divider></v-divider>
            </v-col>
            <v-col
              v-for="category of group"
              :key="category.id"
              xs="6"
              sm="4"
              md="3"
              lg="2"
            >
              <v-chip
                class="mx-md-2"
                @click.stop="openUpdateDialog(category)"
              >
                <v-icon left>label</v-icon>
                {{ category.name }}
              </v-chip>
            </v-col>
          </v-row>

          <v-dialog
            v-model="updateDialog"
            max-width="300px"
            retain-focus
            @click:outside="closeUpdateDialog()"
          >
            <template v-slot:default>
              <v-card>
                <v-card-title>Update category</v-card-title>
                <v-card-text>
                  <category-form
                    :edit="updateDialogCategory"
                    enable-delete
                    @update="onUpdatedOrDeleted()"
                    @delete="onUpdatedOrDeleted()"
                  >
                  </category-form>
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
import Category from '@/models/category';
import CategoryForm from '@/components/CategoryForm.vue';
import CategoriesModule, { getCategoriesStore } from '@/store/categories';

@Component({
  components: { CategoryForm },
})
export default class CategoryManage extends Vue {
  loading = false;
  createDialog = false;
  updateDialog = false;
  updateDialogCategory: Category | null = null;
  search = '';

  private categoriesStore: CategoriesModule = getCategoriesStore();

  @Ref() readonly createForm!: CategoryForm & { reset(): void };

  async created() {
    this.loading = true;
    await this.categoriesStore.fetchCategories();
    this.loading = false;
  }

  get filteredCategories(): Category[] {
    const filterReg = new RegExp(this.search, 'i');
    return this.categoriesStore.categories.filter(
      (category: Category) => filterReg.test(category.name),
    );
  }

  get filteredCategoryGroups(): { [key: string]: Category[] } {
    // categories usually have small amount of items
    if (this.filteredCategories.length < 30) {
      return {
        All: this.filteredCategories,
      };
    }
    return this.filteredCategories
      .reduce((groups: any, category: Category) => {
        if (!groups[category.name.charAt(0)]) {
          groups[category.name.charAt(0)] = [category];
        } else {
          groups[category.name.charAt(0)].push(category);
        }
        return groups;
      }, {});
  }

  onUpdatedOrDeleted() {
    this.updateDialog = false;
    this.updateDialogCategory = null;
  }

  openUpdateDialog(category: Category) {
    this.updateDialogCategory = category;
    this.updateDialog = true;
  }

  closeUpdateDialog() {
    this.updateDialog = false;
    this.updateDialogCategory = null;
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
