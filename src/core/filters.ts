import Vue from 'vue';

Vue.filter('capitalize', (value: string) => (
  value
    .trim()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
));

Vue.filter('date', (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`;
});

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

Vue.filter('image', (value: string) => {
  if (!value) {
    return '';
  }
  if (value.startsWith('blob:')) {
    return value;
  }
  return `${process.env.VUE_APP_BASE_URL}/data/images/${value}`;
});

Vue.filter('video', (value: string) => {
  if (!value) {
    return '';
  }
  if (value.startsWith('blob:')) {
    return value;
  }
  return `${process.env.VUE_APP_BASE_URL}/data/videos/${value}`;
});
