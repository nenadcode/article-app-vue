<template>
  <v-container class="mt-5 pt-5">
    <v-layout row v-if="error">
      <v-flex xs10 offset-xs1 sm6 offset-sm3 lg4 offset-lg4>
        <v-alert
        :value="true"
        type="error">{{ error }}</v-alert>
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
                name="login"
                label="Email"
                type="text"
                v-model="user.email"></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="user.password"></v-text-field>
            </form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click.native="login"
              :disabled="!formIsValid">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        grant_type: 'Bearer',
        email: '',
        password: ''
      },
      error: false
    }
  },
  created () {
    this.token = localStorage['advis-token']
    this.$emit('check-token', this.token)
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    formIsValid () {
      return this.user.email !== '' &&
        this.user.password !== ''
    }
  },
  methods: {
    ...mapActions([
      'getUser'
    ]),
    login () {
      if (!this.formIsValid) {
        return
      }
      let querystring = require('querystring')

      axios
        .post('oauth2/token', querystring.stringify(this.user))
        .then(({ data: token }) => {
          localStorage['advis-token'] = token
          this.error = false
          this.$emit('login', { token })
          this.$router.push({ name: 'articles' })
          this.getUser()
        })
        .catch(err => {
          this.error = err.statusText
        })
    }
  }
}
</script>
