import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Tag from '@/models/tag';
import TagApi from '@/api/tag-api';
import Root from '@/store/index';
import { Store } from 'vuex';

export function getTagsStore(store?: Store<any>): TagsModule {
  return getModule(TagsModule, store);
}

@Module({
  namespaced: true,
  name: 'tags',
  store: Root,
  dynamic: true,
})
export default class TagsModule extends VuexModule {
  tags: Tag[] = [];
  loaded = false;

  get tagById(): (id: number) => Tag | undefined {
    return (id: number) => this.tags.find((cat: Tag) => cat.id === id);
  }

  get tagByIndex(): (index: number) => Tag | undefined {
    return (index: number) => this.tags[index];
  }

  get allTags(): Tag[] {
    return this.tags;
  }

  @Mutation
  private SET_LOADED(loaded = true) {
    this.loaded = loaded;
  }

  @Mutation
  private SET_TAGS(tags: Tag[]) {
    this.tags = tags;
  }

  @Mutation
  private ADD_TAG(tag: Tag) {
    this.tags.unshift(tag);
  }

  @Mutation
  private REMOVE_TAG(id: number) {
    const i = this.tags.findIndex((tag: Tag) => tag.id === id);
    this.tags.splice(i, 1);
  }

  @Mutation
  private UPDATE_TAG({ id, tag }: { id: number; tag: Tag }) {
    const i = this.tags.findIndex((cat: Tag) => cat.id === id);
    Object.assign(this.tags[i], tag);
  }

  @Action({ rawError: true })
  async fetchTags(): Promise<Tag[]> {
    if (!this.loaded) {
      return TagApi
        .getAll({ params: { sort: 'updatedAt,desc' } })
        .then((res) => {
          this.SET_TAGS(res.data);
          this.SET_LOADED(true);
          return res.data;
        });
    }
    return this.tags;
  }

  @Action
  async addTag(tag: TagForm): Promise<Tag> {
    return TagApi
      .create(tag)
      .then((res) => {
        this.tags.unshift(res.data);
        return res.data;
      });
  }

  @Action
  async updateTag({ id, tag }: { id: number; tag: Tag }): Promise<Tag> {
    tag.id = id;
    return TagApi
      .update(id, tag)
      .then((res) => {
        this.UPDATE_TAG({ id, tag: res.data });
        return res.data;
      });
  }

  @Action
  async removeTag(id: number): Promise<void> {
    return TagApi
      .delete(id)
      .then(() => this.REMOVE_TAG(id));
  }
}

interface TagForm {
  name: string;
}
