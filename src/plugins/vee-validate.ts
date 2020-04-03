import Vue from 'vue';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'This field is required',
});

extend('codeFormat', {
  validate: (value: string) => !!value.match(/^[A-Za-z]{3,}-[0-9]{3,}$/),
  message: 'Enter a valid code (Ex: ABC-123)',
});

Vue.component('validation-provider', ValidationProvider);

Vue.component('validation-observer', ValidationObserver);
