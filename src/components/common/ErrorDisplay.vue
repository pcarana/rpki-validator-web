<template>
  <b-container>
    <b-alert
      variant="danger"
      dismissible
      :show="showAlert">
      <p><b>{{ $t(title) }}:</b> {{ $t(message) }}
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
    }
  },
  data () {
    return {
    }
  },
  computed: {
    showAlert: function () {
      return this.error !== null
    },
    title: function () {
      if (!this.showAlert) {
        return ''
      }
      if (this.error.response) {
        switch (this.error.response.status) {
          case 400:
            // Bad request
            return 'errors.http.badRequest.title'
          case 404:
            // Not found
            return 'errors.http.notFound.title'
          case 405:
            // Method not allowed
            return 'errors.http.methodNotAllowed.title'
          case 409:
            // Conflict
            return 'errors.http.conflict.title'
          case 500:
            // Internal server error
            return 'errors.http.internalServer.title'
          default:
            return 'errors.http.default.title'
        }
      }
      // Log the error at console
      console.log(JSON.stringify(this.error))
      if (this.error.request) {
        return 'errors.http.default.title'
      }
      return 'errors.request.incomplete.title'
    },
    message: function () {
      if (!this.showAlert) {
        return ''
      }
      if (this.error.response) {
        switch (this.error.response.status) {
          case 400:
            // Bad request
            return 'errors.http.badRequest.message'
          case 404:
            // Not found
            return 'errors.http.notFound.message'
          case 405:
            // Method not allowed
            return 'errors.http.methodNotAllowed.message'
          case 409:
            // Conflict
            return 'errors.http.conflict.message'
          case 500:
            // Internal server error
            return 'errors.http.internalServer.message'
          default:
            return 'errors.http.default.message'
        }
      }
      if (this.error.request) {
        return 'errors.http.default.message'
      }
      return 'errors.request.incomplete.message'
    }
  }
}
</script>

<style>
</style>
