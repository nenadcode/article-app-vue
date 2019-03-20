import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import * as firebase from 'firebase'
import axios from 'axios'
import config from '@/config'
import router from './router'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store/index.js'
import VeeValidate, { Validator } from 'vee-validate'
import en from 'vee-validate/dist/locale/en'
import AlertCmp from './components/shared/Alert.vue'

Vue.component('app-alert', AlertCmp)

axios.defaults.baseURL = config.api

Vue.config.productionTip = false

const Veeconfig = {
  locale: 'en'
}

const dictionary = {
  en: {
    messages: {
      regex: 'Minimum 6 characters, one capital letter, one number and one special character'
    }
  }
}

Validator.localize({ en: en })

Validator.localize(dictionary)

Vue.use(VeeValidate, Veeconfig)

Vue.use(Vuetify, {
  theme: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#ff0000',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

new Vue({
  router,
  store,
  Vuetify,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyB6goV4HSIj9iXvLdc-uRPo0H48krah6Tw',
      authDomain: 'article-app-277f2.firebaseapp.com',
      databaseURL: 'https://article-app-277f2.firebaseio.com',
      projectId: 'article-app-277f2',
      storageBucket: 'article-app-277f2.appspot.com'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        // this.$store.dispatch('getUser')
      }
    })
  }
}).$mount('#app')
