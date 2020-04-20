<template>
  <v-app>
    <app-app-bar @click:nav-icon="drawer = !drawer"></app-app-bar>
    <app-nav-drawer v-model="drawer"></app-nav-drawer>
    <v-content>
      <v-container fill-height class="align-start">
        <v-row justify="center">
          <v-col lg="11">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <the-snackbar></the-snackbar>
    <the-notify-modal></the-notify-modal>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheSnackbar from '@/components/notify/TheSnackbar.vue';
import AppNavDrawer from '@/components/app/AppNavDrawer.vue';
import TheNotifyModal from '@/components/notify/TheNotifyModal.vue';
import AppAppBar from '@/components/app/AppAppBar.vue';

@Component({
  components: { AppAppBar, TheNotifyModal, AppNavDrawer, TheSnackbar },
})
export default class App extends Vue {
  drawer = false;
}
</script>
