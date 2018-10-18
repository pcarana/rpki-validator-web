<template>
  <b-container>
    <b-alert
      variant="danger"
      dismissible
      :show="showAlert">
      <p><b>{{ $t(title) }}:</b> {{ $t(message) }}
      <span v-if="showLogin && callLogin">
        , <a href="#" @click="callLogin">{{ $t('errors.tryLogin') }}</a>
      </span>
      <span v-if="showRetry && callRetry">
        , <a href="#" @click="callRetry">{{ $t('errors.tryAgain') }}</a>
      </span>
      <span v-if="error && error.response && error.response.data">
        . {{ $t('errors.serverMessage', {serverMessage: error.response.data.message}) }}
      </span></p>
    </b-alert>
  </b-container>
</template>

<script>
export default {
  props: {
    error: {
      type: [Object, Error],
      default: null
    },
    callLogin: {
      type: Function,
      default: null
    },
    callRetry: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      retryErrors: [
        'errors.http.internalServer',
        'errors.http.default',
        'errors.request.incomplete'
      ]
    }
  },
  computed: {
    showAlert: function () {
      return this.error !== null
    },
    showLogin: function () {
      return this.error && this.error.response && this.error.response.status === 401
    },
    showRetry: function () {
      let errorType = this.errorType
      return this.retryErrors.includes(errorType)
    },
    errorType: function () {
      if (!this.showAlert) {
        return null
      }
      if (this.error.response) {
        switch (this.error.response.status) {
          case 400:
            // Bad request
            return 'errors.http.badRequest'
          case 401:
            // Unauthorized
            return 'errors.http.unauthorized'
          case 404:
            // Not found
            return 'errors.http.notFound'
          case 405:
            // Method not allowed
            return 'errors.http.methodNotAllowed'
          case 409:
            // Conflict
            return 'errors.http.conflict'
          case 500:
            // Internal server error
            return 'errors.http.internalServer'
          default:
            return 'errors.http.default'
        }
      }
      if (this.error.request) {
        return 'errors.http.default'
      }
      return 'errors.request.incomplete'
    },
    title: function () {
      // Log the error at console
      console.log(JSON.stringify(this.error))
      return this.errorType !== null ? this.errorType + '.title' : ''
    },
    message: function () {
      return this.errorType !== null ? this.errorType + '.message' : ''
    }
  }
}
</script>

<style>
</style>
