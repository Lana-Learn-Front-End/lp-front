<template>
  <v-container fill-height class="align-start">
    <v-row justify="center">
      <v-col lg="11" xl="10">
        <v-container fill-height fluid>
          <slot></slot>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class BaseContentWrapper extends Vue {
}
</script>
