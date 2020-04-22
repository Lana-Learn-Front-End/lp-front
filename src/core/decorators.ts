import { createDecorator } from 'vue-class-component';
import { debounce } from 'throttle-debounce';

export function Debounce(timeout: number) {
  return createDecorator((componentOptions, handler) => {
    if (!componentOptions.methods) {
      throw new Error('This decorator must be used on a vue component method.');
    }
    componentOptions.methods[handler] = debounce(timeout, componentOptions.methods[handler]);
  });
}

export function Hook(name?: string) {
  return createDecorator((componentOptions: any, handler) => {
    if (![
      'data',
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeDestroy',
      'destroyed',
      'beforeUpdate',
      'updated',
    ].includes(name || handler)) {
      throw new Error(`Invalid hook: '${handler}'`);
    }
    if (name && name !== handler) {
      if (!componentOptions.methods) {
        if (!componentOptions[handler]) {
          throw new Error('This decorator must be used on a vue component method.');
        }
        componentOptions[name] = componentOptions[handler];
        delete componentOptions[handler];
        return;
      }
      componentOptions[name] = componentOptions.methods[handler];
      delete componentOptions.methods[handler];
    }
    // Do nothing, this if name not provided, this hook only provide name check
    // as lifecycle-hooks are already registered
  });
}

export function RouterHook(name?: string) {
  return createDecorator((componentOptions: any, handler) => {
    if (!componentOptions.methods) {
      throw new Error('This decorator must be used on a vue component method.');
    }
    if (![
      'beforeRouteEnter',
      'beforeRouteLeave',
      'beforeRouteUpdate',
    ].includes(name || handler)) {
      throw new Error(`Invalid router hook: '${name || handler}'`);
    }
    // resign router hook
    componentOptions[name || handler] = componentOptions.methods[handler];
    delete componentOptions.methods[handler];
  });
}
