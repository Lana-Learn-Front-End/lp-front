<template>
  <v-app>
    <v-app-bar clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-toolbar-title> App</v-toolbar-title>
    </v-app-bar>

    <app-nav-drawer v-model="drawer"></app-nav-drawer>

    <v-content>
      <base-content-wrapper>
        <router-view></router-view>
      </base-content-wrapper>
    </v-content>
    <the-snackbar></the-snackbar>
    <the-notify-modal></the-notify-modal>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheSnackbar from '@/components/notify/TheSnackbar.vue';
import AppNavDrawer from '@/components/AppNavDrawer.vue';
import BaseContentWrapper from '@/components/BaseContentWrapper.vue';
import TheNotifyModal from '@/components/notify/TheNotifyModal.vue';

@Component({
  components: { TheNotifyModal, BaseContentWrapper, AppNavDrawer, TheSnackbar },
})
export default class App extends Vue {
  drawer = false;
}
</script>
