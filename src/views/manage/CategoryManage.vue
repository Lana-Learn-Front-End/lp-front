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
      <div class="mt-5 mt-md-8">
        <div class="d-flex justify-center" v-if="loading">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>

        <div class="text-center" v-show="!loading && filteredCategories.length  === 0">
          <span class="body-1">No categories found</span>
        </div>

        <div>
          <v-chip
            v-for="category of filteredCategories"
            v-bind:key="category.name"
            class="my-1 mx-1 mx-md-2"
            @click.stop="openUpdateDialog(category)"
          >
            <v-icon left>label</v-icon>
            {{ category.name }}
          </v-chip>

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
import { Component, Vue } from 'vue-property-decorator';
import Category from '@/models/category';
import CategoryForm from '@/components/CategoryForm.vue';
import { AxiosResponse } from 'axios';

@Component({
  components: { CategoryForm },
})
export default class CategoryManage extends Vue {
  categories: Category[] = [];
  loading = false;
  createDialog = false;
  updateDialog = false;
  updateDialogCategory: Category | null = null;
  search = '';

  $refs!: {
    createForm: CategoryForm & { reset(): void };
  };

  created() {
    this.fetchCategories();
  }

  get filteredCategories(): Category[] {
    const filterReg = new RegExp(this.search, 'i');
    return this.categories.filter(
      (category: Category) => filterReg.test(category.name),
    );
  }

  onUpdatedOrDeleted() {
    this.updateDialog = false;
    this.updateDialogCategory = null;
    this.fetchCategories();
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
    this.fetchCategories();
  }

  closeCreateDialog() {
    this.createDialog = false;
    this.$refs.createForm.reset();
  }

  private fetchCategories() {
    this.loading = true;
    this.$axios
      .get<Category[]>('/api/categories/all')
      .then((res: AxiosResponse<Category[]>) => {
        this.categories = res.data;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
