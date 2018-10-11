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
        <error-display :error="error"></error-display>
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
