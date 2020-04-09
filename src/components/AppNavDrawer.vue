<template>
  <v-navigation-drawer
    :value="value"
    @input="drawerChange($event)"
    clipped
    app
  >
    <v-list nav>
      <v-list-item to="/home">
        <v-list-item-icon>
          <v-icon>home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <div>
        <v-divider></v-divider>
        <v-subheader>Administration</v-subheader>
        <v-list-item to="/manage">
          <v-list-item-icon>
            <v-icon>list_alt</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Manage Content</v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">

import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppNavDrawer extends Vue {
  @Prop({ type: Boolean }) value!: boolean;

  @Emit('input')
  drawerChange(drawer: boolean) {
    return drawer;
  }
}
</script>
