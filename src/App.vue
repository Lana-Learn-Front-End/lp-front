<template>
  <v-app>
    <v-app-bar clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-toolbar-title> App</v-toolbar-title>
    </v-app-bar>

    <app-nav-drawer v-model="drawer"></app-nav-drawer>

    <v-content>
      <v-container fill-height class="pt-6 pt-md-8 pt-lg-10 align-start">
        <v-row justify="center">
          <v-col lg="11" xl="10">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <the-snackbar></the-snackbar>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheSnackbar from '@/components/TheSnackbar.vue';
import AppNavDrawer from '@/components/AppNavDrawer.vue';

@Component({
  components: { AppNavDrawer, TheSnackbar },
})
export default class App extends Vue {
  drawer = false;
}
</script>
