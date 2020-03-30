<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
    >
    </v-navigation-drawer>

    <v-app-bar clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-toolbar-title> App</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  drawer: boolean = false;
}
</script>
