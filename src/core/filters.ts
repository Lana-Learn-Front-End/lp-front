import Vue from 'vue';

Vue.filter('capitalize', (value: string) => (
  value
    .trim()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
));

Vue.filter('truncate', (value: string, maxLength: number, ellipsis?: boolean) => {
  if (value.length <= maxLength) {
    return value;
  }
  if (!ellipsis) {
    return value.substr(0, maxLength);
  }
  maxLength -= 3;
  return `${value.substr(0, maxLength)}...`;
});

Vue.filter('mediaSource', (value: string, ...paths: string[]) => {
  if (value.startsWith('blob:')) {
    return value;
  }
  return `${process.env.VUE_APP_BASE_URL}/data/${paths.join('/')}/${value}`;
});
