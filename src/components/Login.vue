<template>
  <v-container class="mt-5 pt-5">
    <v-layout row v-if="storeError">
      <v-flex xs10 offset-xs1 sm6 offset-sm3 lg4 offset-lg4>
        <v-alert
        :value="true"
        type="error">{{ storeError.message }}</v-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs10 offset-xs1 sm6 offset-sm3 lg4 offset-lg4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <form>
              <v-text-field
                prepend-icon="email"
                v-validate="'required|email'"
                name="Email"
                label="Email"
                type="text"
                v-model="user.email"></v-text-field>
              <span
                v-show="errors.has('Email')"
                class="errorMessage">{{ errors.first('Email') }}</span>

              <v-text-field
                prepend-icon="lock"
                v-validate="{ required: true, regex: /(?=^.{6,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/ }"
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="user.password"></v-text-field>
              <span
                id="password-error"
                v-show="errors.has('password')"
                class="errorMessage">{{ errors.first('password') }}</span>
            </form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click.native="onLogin"
              :disabled="errors.any() || !formIsValid"
              :loading="loading">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      error: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'storeError',
      'loading'
    ]),
    formIsValid () {
      return this.user.email !== '' &&
        this.user.password !== ''
    }
  },
  methods: {
    onLogin () {
      this.$store.dispatch('loginUser', {
        email: this.user.email,
        password: this.user.password
      })
    },
  },
  watch: {
    'userInfo' (value) {
      if (value !== null && value !== undefined) {
        this.$router.push({ name: 'articles' })
      }
    }
  }
}
</script>
