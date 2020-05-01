import { createDecorator } from 'vue-class-component';
import { debounce } from 'throttle-debounce';
import { Location } from 'vue-router';

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

/**
 * decorator of a data prop that synced with query
 * @param options - the options for the synced query
 * @param options.type - the type of data prop, can only be String or Number
 * @param options.default - the default value for data prop
 * @param options.query - the name of query param
 * @param options.consistent - whether to show query param when its at default value
 * @param options.push - whether to use $router.push which gonna trigger RouteUpdate
 * @param options.debounce - debounce timeout
 * @return PropertyDecorator | void
 */
export function QuerySync(options?: QuerySyncOptions) {
  return createDecorator((componentOptions, key) => {
    const defaultValue = options?.default ?? ((options?.type === Number) ? 0 : '');
    const queryKey = options?.query || key;

    (componentOptions.computed || (componentOptions.computed = {}))[key] = {
      get(): string | number {
        if (options?.type === Number) {
          const number = Number(this.$route.query[queryKey]);
          return Number.isNaN(number) ? defaultValue : number;
        }
        return this.$route.query[queryKey] ?? defaultValue;
      },
      set: debounce(options?.debounce || 0, function setQuery(value: string | number) {
        // Same route navigate
        if (this.$route.query[queryKey] === (value ?? defaultValue)) {
          return;
        }
        // Same route navigate for default value
        if (!options?.consistent && !this.$route.query[queryKey] && value === defaultValue) {
          return;
        }

        const location: Location = {
          query: {
            ...this.$route.query,
            [queryKey]: value ?? defaultValue,
          },
        };

        if (location.query && !options?.consistent && location.query[queryKey] === defaultValue) {
          delete location.query[queryKey];
        }

        if (options?.push) {
          this.$router.push(location);
        } else {
          this.$router.replace(location);
        }
      }),
    };
  });
}

interface QuerySyncOptions {
  type?: typeof Number | typeof String;
  query?: string;
  default?: string | number;
  debounce?: number;
  consistent?: boolean;
  push?: boolean;
}
