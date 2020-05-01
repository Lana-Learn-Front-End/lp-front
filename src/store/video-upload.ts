import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Root from '@/store/index';
import { Store } from 'vuex';

export function getVideoUploadStore(store?: Store<any>): VideoUploadModule {
  return getModule(VideoUploadModule, store);
}

@Module({
  namespaced: true,
  name: 'casts',
  store: Root,
  dynamic: true,
})
export default class VideoUploadModule extends VuexModule {
  private uploads: Map<number, UploadProgress> = new Map<number, UploadProgress>();

  @Mutation
  private SET_UPLOAD(id: number, upload: UploadProgress) {
    this.uploads.set(id, upload);
  }

  @Mutation
  private SET_UPLOAD_STATUS(id: number, status: UploadStatus) {
    const upload: UploadProgress | undefined = this.uploads.get(id);
    if (upload) {
      upload.status = status;
    }
  }

  @Mutation
  private SET_UPLOAD_PROGRESS(id: number, progress: number) {
    const upload: UploadProgress | undefined = this.uploads.get(id);
    if (upload) {
      upload.progress = progress;
    }
  }
}

interface UploadProgress {
  name: string;
  progress: number;
  status: UploadStatus;
}

export enum UploadStatus {
  uploading,
  pending,
  success,
  failed,
  canceled,
}
