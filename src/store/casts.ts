import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Cast from '@/models/cast';
import CastApi from '@/api/cast-api';
import Root from '@/store/index';
import { Store } from 'vuex';

export function getCastsStore(store?: Store<any>): CastsModule {
  return getModule(CastsModule, store);
}

@Module({
  namespaced: true,
  name: 'casts',
  store: Root,
  dynamic: true,
})
export default class CastsModule extends VuexModule {
  casts: Cast[] = [];
  loaded = false;

  get castById(): (id: number) => Cast | undefined {
    return (id: number) => this.casts.find((cat: Cast) => cat.id === id);
  }

  get castByIndex(): (index: number) => Cast | undefined {
    return (index: number) => this.casts[index];
  }

  get allCasts(): Cast[] {
    return this.casts;
  }

  @Mutation
  private SET_LOADED(loaded = true) {
    this.loaded = loaded;
  }

  @Mutation
  private SET_CASTS(casts: Cast[]) {
    this.casts = casts;
  }

  @Mutation
  private ADD_CAST(cast: Cast) {
    this.casts.push(cast);
  }

  @Mutation
  private REMOVE_CAST(id: number) {
    const i = this.casts.findIndex((cast: Cast) => cast.id === id);
    this.casts.splice(i, 1);
  }

  @Mutation
  private UPDATE_CAST({ id, cast }: { id: number; cast: Cast }) {
    const i = this.casts.findIndex((cat: Cast) => cat.id === id);
    Object.assign(this.casts[i], cast);
  }

  @Action({ rawError: true })
  async fetchCasts(): Promise<Cast[]> {
    if (!this.loaded) {
      return CastApi
        .getAll()
        .then((res) => {
          this.SET_CASTS(res.data);
          this.SET_LOADED(true);
          return res.data;
        });
    }
    return this.casts;
  }

  @Action
  async addCast(cast: CastForm): Promise<Cast> {
    return CastApi
      .create(cast)
      .then((res) => {
        this.casts.push(res.data);
        return res.data;
      });
  }

  @Action
  async updateCast({ id, cast }: { id: number; cast: Cast }): Promise<Cast> {
    cast.id = id;
    return CastApi
      .update(id, cast)
      .then((res) => {
        this.UPDATE_CAST({ id, cast: res.data });
        return res.data;
      });
  }

  @Action
  async removeCast(id: number): Promise<void> {
    return CastApi
      .delete(id)
      .then(() => this.REMOVE_CAST(id));
  }
}

interface CastForm {
  name: string;
  birth: string;
}
