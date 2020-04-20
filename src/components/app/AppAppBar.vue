<template>
  <div>
    <v-app-bar
      app
      clipped-left
      :extension-height="searchExtensionHeight"
    >
      <v-app-bar-nav-icon @click.stop="onNavIconClicked()"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        solo
        flat
        hide-details
        prepend-inner-icon="search"
        label="Search for movies"
        class="hidden-sm-and-down"
        @keypress.enter="onSearch($event.target.value)"
      >
      </v-text-field>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="hidden-md-and-up"
        @click="searchExtension = !searchExtension"
      >
        <v-icon>search</v-icon>
      </v-btn>

      <template v-slot:extension>
        <div class="w-100" v-show="searchExtensionHeight > 0">
          <v-divider></v-divider>
          <v-text-field
            clearable
            solo
            flat
            hide-details
            color="grey"
            prepend-inner-icon="search"
            label="Search for movies"
            @click:clear="searchExtension = false"
            @keypress.enter="onSearch($event.target.value)"
            class="transparent"
          >
          </v-text-field>
        </div>
      </template>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppAppBar extends Vue {
  @Prop({ type: String, default: 'Application' }) title!: string;
  searchExtension = false;

  @Emit('click:nav-icon')
  onNavIconClicked() {
  }

  get searchExtensionHeight(): number {
    return this.$vuetify.breakpoint.smAndDown && this.searchExtension ? 48 : 0;
  }

  onSearch(keyword: string) {
    this.$router.push({
      name: 'MovieSearch',
      query: {
        keyword,
      },
    });
  }
}
</script>

<style scoped>
  /deep/ .v-toolbar__extension {
    padding: 0 !important;
  }

  /deep/ .transparent .v-input__slot {
    padding: 0 16px !important;
    background: none !important;
  }
</style>
