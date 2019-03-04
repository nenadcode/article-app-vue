<template>
  <div id="app">
    <v-app id="inspire">
      <app-header></app-header>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    appHeader: Header
  }
}
</script>

<style>
 a:hover {
    text-decoration: none;
  }

  .btn.btn--flat.btn--large,
  .btn.btn--flat,
  .btn.primary,
  .btn.accent {
    padding: 0;
  }

  .btn.btn--flat.btn--large {
    margin: 0;
  }

  .btn--large .btn__content {
    padding: 0 16px;
  }

  .toolbar__title {
    margin-left: 0;
  }

  .toolbar__items .btn {
    height: 44px;
    margin: 2px 0;
  }

  .btn .btn__content .icon {
    padding-bottom: 14px;
  }

  .btn .btn__content .icon.icon--left {
    padding-bottom: 2px;
  }

  .btn .icon--left {
    margin-right: 10px;
  }

  .primary {
    border-color: none;
  }

  .errorMessage {
    color: #ff0000;
  }
</style>
