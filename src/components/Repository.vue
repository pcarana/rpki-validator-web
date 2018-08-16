<template>
    <div class="container mt-2 mx-4">
      <h1>{{ $t('repositories.title') }} {{ this.$route.params.talId }}</h1>
      <p>{{ tal }}</p>
      <p v-if="error">{{ error }}</p>
      <b-button @click="back">{{ $t('general.return') }}</b-button>
    </div>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      eventHub: null,
      tal: null,
      error: null
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    successCb (response) {
      this.tal = response.data
    },
    errorCb (error) {
      this.error = error
    }
  },
  created: function () {
    const service = config.api.services.get.talDetail.replace(':id', this.$route.params.talId)
    axios.get(this.$root.$i18n.locale, service, this.successCb, this.errorCb, this.eventHub)
  }
}
</script>

<style>
</style>
