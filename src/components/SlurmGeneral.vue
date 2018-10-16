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
        <error-display :error="error" :callLogin="callLogin"></error-display>
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
      loading: false
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  methods: {
    loadData (auth) {
      this.error = null
      this.loading = true
      let promise = this.promiseCb(this.$root.$i18n.locale,
        config.api.services.get.slurmGeneral,
        auth)
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
      this.callLogin()
    },
    finallyCb () {
      this.loading = false
    },
    promiseCb (auth) {
      return axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        config.api.services.get.slurmGeneral,
        auth)
    },
    callLogin () {
      this.checkAuth(this.error, this.promiseCb, this.successCb, this.errorCb)
    }
  },
  created: function () {
    this.loadData(null)
  }
}
</script>

<style>
</style>
