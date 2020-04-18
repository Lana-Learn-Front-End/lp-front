import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Category from '@/models/category';
import CategoryApi from '@/api/category-api';
import Root from '@/store/index';
import { Store } from 'vuex';

export function getCategoriesStore(store?: Store<any>): CategoriesModule {
  return getModule(CategoriesModule, store);
}

@Module({
  namespaced: true,
  name: 'categories',
  store: Root,
  dynamic: true,
})
export default class CategoriesModule extends VuexModule {
  categories: Category[] = [];
  loaded = false;

  get categoryById(): (id: number) => Category | undefined {
    return (id: number) => this.categories.find((cat: Category) => cat.id === id);
  }

  get categoryByIndex(): (index: number) => Category | undefined {
    return (index: number) => this.categories[index];
  }

  get allCategories(): Category[] {
    return this.categories;
  }

  @Mutation
  private SET_LOADED(loaded = true) {
    this.loaded = loaded;
  }

  @Mutation
  private SET_CATEGORIES(categories: Category[]) {
    this.categories = categories;
  }

  @Mutation
  private ADD_CATEGORY(category: Category) {
    this.categories.unshift(category);
  }

  @Mutation
  private REMOVE_CATEGORY(id: number) {
    const i = this.categories.findIndex((category: Category) => category.id === id);
    this.categories.splice(i, 1);
  }

  @Mutation
  private UPDATE_CATEGORY({ id, category }: { id: number; category: Category }) {
    const i = this.categories.findIndex((cat: Category) => cat.id === id);
    Object.assign(this.categories[i], category);
  }

  @Action({ rawError: true })
  async fetchCategories(): Promise<Category[]> {
    if (!this.loaded) {
      return CategoryApi
        .getAll({ params: { sort: 'updatedAt,desc' } })
        .then((res) => {
          this.SET_CATEGORIES(res.data);
          this.SET_LOADED(true);
          return res.data;
        });
    }
    return this.categories;
  }

  @Action
  async addCategory(category: CategoryForm): Promise<Category> {
    return CategoryApi
      .create(category)
      .then((res) => {
        this.categories.unshift(res.data);
        return res.data;
      });
  }

  @Action
  async updateCategory({ id, category }: { id: number; category: Category }): Promise<Category> {
    category.id = id;
    return CategoryApi
      .update(id, category)
      .then((res) => {
        this.UPDATE_CATEGORY({ id, category: res.data });
        return res.data;
      });
  }

  @Action
  async removeCategory(id: number): Promise<void> {
    return CategoryApi
      .delete(id)
      .then(() => this.REMOVE_CATEGORY(id));
  }
}

interface CategoryForm {
  name: string;
}
