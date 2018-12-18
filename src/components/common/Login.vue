<template>
  <span>
    <b-modal
      id="loginModal"
      ref="loginModal"
      @shown="focusFirstField"
      title="Login"
      ok-title="OK"
      cancel-title="Cancel"
      @ok="requestToken"
      @hidden="clearData">
      <b-container fluid>
        <b-row>
          <b-col cols="12">
            <loading :show="loading"></loading>
          </b-col>
        </b-row>
        <b-row class="mb-1" v-if="loginError">
          <b-col>
            <b-alert show variant="danger">
              {{ $t('errors.invalidCredentials') }}
            </b-alert>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2"><label for="username">{{ $t('login.username') }}</label></b-col>
          <b-col>
            <b-form-group id="userGroup">
              <b-form-input id="username"
                ref="username"
                type="text"
                v-model.trim="auth.username"
                :state="usernameState">
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t('errors.usernameRequired') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2"><label for="password">{{ $t('login.password') }}</label></b-col>
          <b-col>
            <b-form-group id="passwordGroup">
              <b-form-input id="password"
                ref="password"
                type="password"
                v-model.trim="auth.password"
                :state="passwordState"
                @keyup.native.enter="requestToken">
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t('errors.passwordRequired') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </span>
</template>

<script>
import Loading from '@/components/common/Loading.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      loading: false,
      // Expected object with 3 props: promiseCallback, successCallback, errorCallback
      callbackSet: null,
      loginError: null,
      auth: {
        username: null,
        password: null
      }
      // loginModalId is set using main mixin
    }
  },
  components: {
    'loading': Loading
  },
  methods: {
    focusFirstField () {
      this.clearData()
      this.$refs.username.focus()
    },
    requestToken (event) {
      event.preventDefault()
      let me = this
      this.loading = true
      this.loginError = null
      let myAxios = axios.createAxios(me.$root.$i18n.locale)
      axios.setBasicAuth(myAxios, me.auth)
      myAxios.get(config.api.services.get.tokens).then(function (response) {
        me.$refs.loginModal.hide()
        localStorage.setItem('t', response.data.token)
        me.callbackSet.retryCallback(true)
      }).catch(function (error) {
        if (error.response && error.response.status === 401) {
          me.loginError = error
        } else {
          me.$refs.loginModal.hide()
          me.callbackSet.errorCallback(error)
        }
      }).finally(function () {
        me.loading = false
      })
    },
    clearData () {
      this.loginError = null
      this.auth.username = null
      this.auth.password = null
    },
    showLoginModal () {
      this.$refs.loginModal.show()
    }
  },
  computed: {
    usernameState: function () {
      if (!this.auth.username) {
        return false
      }
      return true
    },
    passwordState: function () {
      if (!this.auth.password) {
        return false
      }
      return true
    }
  }
}
</script>

<style>
</style>
