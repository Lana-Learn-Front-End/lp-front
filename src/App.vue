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
      <v-container fill-height class="pt-6 pt-md-8 pt-lg-10 align-start">
        <router-view></router-view>
      </v-container>
    </v-content>
    <the-snackbar></the-snackbar>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheSnackbar from '@/components/TheSnackbar.vue';

@Component({
  components: { TheSnackbar },
})
export default class App extends Vue {
  drawer = false;
}
</script>
