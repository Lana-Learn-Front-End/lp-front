<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">
          <span>{{ currentSort.text }}</span>
          <v-icon right>arrow_drop_down</v-icon>
        </v-btn>
      </template>
      <template v-slot:default>
        <v-list dense>
          <v-list-item
            class="body-2"
            v-for="sort of sorts"
            v-bind:key="sort.value"
            @click="sortChange(sort)"
          >
            {{ sort.text }}
          </v-list-item>
        </v-list>
      </template>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MovieSortingDropdown extends Vue {
  @Prop() value!: string;

  sorts: Sort[] = [
    { value: '', text: 'Default' },
    { value: 'name,asc', text: 'Name' },
    { value: 'modifiedAt,asc', text: 'Latest' },
  ];

  get currentSort(): Sort {
    return this.sorts.find((sort: Sort) => sort.value === this.value) || this.sorts[0];
  }

  @Emit('input')
  sortChange(sort: Sort): string {
    return sort.value;
  }
}

interface Sort {
  value: string;
  text: string;
}
</script>
