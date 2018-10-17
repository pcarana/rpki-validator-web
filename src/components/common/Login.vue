<template>
  <span>
    <b-modal
      :id="loginModalId"
      :ref="loginModalId"
      @shown="focusFirstField"
      title="Login"
      ok-title="OK"
      cancel-title="Cancel"
      @ok="sendRequest">
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
                @keyup.native.enter="sendRequest">
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
      this.loginError = null
      this.auth.username = null
      this.auth.password = null
      this.$refs.username.focus()
    },
    sendRequest (event) {
      event.preventDefault()
      let me = this
      this.loading = true
      this.loginError = null
      let promise = this.callbackSet.promiseCallback(this.auth)
      promise.then(function (response) {
        me.$refs[me.loginModalId].hide()
        me.callbackSet.successCallback(response)
      }).catch(function (error) {
        console.log(error)
        if (error.response && error.response.status === 401) {
          me.loginError = error
        } else {
          me.$refs[me.loginModalId].hide()
          me.callbackSet.errorCallback(error)
        }
      }).finally(function () {
        me.loading = false
      })
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
