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
          <v-toolbar dark color="accent">
            <v-toolbar-title>Register</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <form>
              <v-text-field
                class="input-field"
                v-validate="'required|email'"
                name="email"
                label="E-mail"
                type="text"
                v-model="newUser.email"></v-text-field>
              <span
                v-show="errors.has('email')"
                class="errorMessage">{{ errors.first('email') }}</span>

              <v-text-field
                class="input-field"
                v-validate="{ required: true, regex: /(?=^.{6,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/ }"
                name="Password"
                label="Password"
                id="password"
                type="password"
                ref="password"
                v-model="newUser.pass"></v-text-field>
              <span
                id="password-error"
                v-show="errors.has('Password')"
                class="errorMessage">{{ errors.first('Password') }}</span>

                <v-text-field
                  class="input-field"
                  v-validate="'required|confirmed:password'"
                  name="Confirm Password"
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  v-model="newUser.confirmPass"></v-text-field>
                <span
                  id="confirm-password-error"
                  v-show="errors.has('Confirm Password')"
                  class="errorMessage">{{ errors.first('Confirm Password') }}</span>
            </form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="accent"
              @click.native="onRegister"
              :disabled="errors.any() || !formIsValid"
              :loading="loading">Register</v-btn>
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
  name: 'Register',
  data () {
    return {
      newUser: {
        email: '',
        pass: '',
        confirmPass: ''
      },
      error: false
    }
  },
  computed: {
    ...mapGetters([
      'storeError',
      'loading'
    ]),
    formIsValid () {
      return this.newUser.email !== '' &&
        this.newUser.pass !== '' &&
        this.newUser.confirmPass !== ''
    },
    user () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    onRegister () {
        this.$store.dispatch('registerUser', {
          email: this.newUser.email,
          password: this.newUser.pass
        })
      }
  },
  watch: {
    'user' (value) {
      if (value !== null && value !== undefined) {
        this.$router.push({ name: 'login' })
      }
    }
  }
}
</script>

<style scoped>
  .input-group .input-group__details {
    min-height: 10px;
  }
</style>
