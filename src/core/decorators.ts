import { createDecorator } from 'vue-class-component';
import { debounce } from 'throttle-debounce';

export function Debounce(timeout: number) {
  return createDecorator((opts, handler) => {
    if (!opts.methods) {
      throw new Error('This decorator must be used on a vue component method.');
    }
    opts.methods[handler] = debounce(timeout, opts.methods[handler]);
  });
}
