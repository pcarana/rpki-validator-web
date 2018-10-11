<template>
  <b-container class="mt-2 mx-4">
    <h1>{{ $t('slurm.general.title') }}</h1>
    <p>{{ $t('slurm.general.description') }}</p>
    <loading :show="loading"></loading>
    <error-display :error="error"></error-display>
    <b-card v-if="slurm">
      <json-object :object="slurm"></json-object>
    </b-card>
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
    loadData () {
      this.loading = true
      axios.get(this.$root.$i18n.locale,
        config.api.services.get.slurmGeneral,
        this.successCb,
        this.errorCb,
        this.finallyCb)
    },
    successCb (response) {
      this.slurm = response.data
    },
    errorCb (error) {
      this.error = error
    },
    finallyCb () {
      this.loading = false
    }
  },
  created: function () {
    this.loadData()
  }
}
</script>

<style>
</style>
