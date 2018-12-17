<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col>
        <h1>{{ $t('slurm.general.title') }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>{{ $t('slurm.general.description') }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <loading :show="loading"></loading>
        <error-display :error="error" :callLogin="callLogin" :callRetry="loadData"></error-display>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card v-if="slurm">
          <json-object :object="slurm"></json-object>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import Loading from '@/components/common/Loading.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      slurm: null,
      error: null,
      loading: false,
      useToken: false
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  methods: {
    loadData (useToken) {
      this.error = null
      this.loading = true
      this.useToken = useToken
      let promise = axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        config.api.services.get.slurmGeneral,
        useToken)
      axios.processPromise(promise,
        this.successCb,
        this.errorCb,
        this.finallyCb)
    },
    successCb (response) {
      this.slurm = response.data
      this.error = null
    },
    errorCb (error) {
      this.error = error
      this.slurm = null
      this.callLogin()
    },
    finallyCb () {
      this.loading = false
    },
    callLogin () {
      this.checkAuth(this.error, this.loadData, this.errorCb)
    }
  },
  created: function () {
    this.loadData(this.useToken)
  }
}
</script>

<style>
</style>
