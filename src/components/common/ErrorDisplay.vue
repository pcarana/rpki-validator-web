<template>
  <b-container>
    <b-alert
      variant="danger"
      :show="showAlert">
      <span v-if="actionError" v-html="actionError"></span>
      <p v-else>
        <b>{{ $t(title) }}:</b> {{ $t(message) }}
        <span v-if="tryLogin && callLogin">
          , <a href="#" @click="callLogin">{{ $t('errors.tryLogin') }}</a>
        </span>
        <span v-if="tryAgain && callRetry">
          , <a href="#" @click="callRetry">{{ $t('errors.tryAgain') }}</a>
        </span>
        <span v-if="error && error.response && error.response.data">
          . {{ $t('errors.serverMessage', {serverMessage: error.response.data.message}) }}
        </span>
      </p>
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
    },
    apiObject: {
      type: Object,
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
    tryLogin: function () {
      return this.error && this.error.response && this.error.response.status === 401
    },
    tryAgain: function () {
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
      if (this.error) {
        if (this.error.response) {
          console.log(this.error.response.status + ' at ' + this.error.response.config.url)
        } else {
          console.log(JSON.stringify(this.error))
        }
      }
      return this.errorType !== null ? this.errorType + '.title' : ''
    },
    message: function () {
      return this.errorType !== null ? this.errorType + '.message' : ''
    },
    actionError: function () {
      if (this.errorType === 'errors.http.badRequest' && this.error.response.data.message) {
        let responseErrors = this.error.response.data.errors
        let htmlErrorMessage = this.error.response.data.message
        if (!responseErrors || responseErrors.length < 1) {
          return null
        }
        let list = '<ul>'
        // The properties aren't mapped, show them 'raw'
        if (!this.apiObject) {
          for (let currErr of responseErrors) {
            list += '<li><b>' + currErr.title + ':</b> ' + currErr.description + '</li>'
          }
          htmlErrorMessage += list
          return htmlErrorMessage
        }
        // Otherwise, show them using the indicated properties mapping
        for (let currErr of responseErrors) {
          let errorSplit = currErr.title.split('.')
          let message = ''
          if (errorSplit.length > 1) {
            message = this.i18n.t(this.apiObject[errorSplit[1]])
          } else {
            message = this.i18n.t(this.apiObject.object)
          }
          list += '<li><b>' + message
          list += ':</b> ' + currErr.description + '</li>'
        }
        list += '</ul>'
        htmlErrorMessage += list
        return htmlErrorMessage
      }
      if (this.error && this.error.validationMessage) {
        return this.i18n.t(this.error.validationMessage)
      }
      return null
    }
  }
}
</script>

<style>
</style>
