<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col cols="12">
        <h1>{{ $t('repository.title') }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="10">
        <loading :show="loading"></loading>
        <error-display :error="error" :callLogin="callLogin"></error-display>
      </b-col>
    </b-row>
    <b-row v-if="tal">
      <b-col cols="8">
        <b-card :title="$t('repository.general.title')">
          <h5>{{ $t('repository.general.uris') }}</h5>
          <p v-for="uri in tal.uris" :key="uri.location">
            {{ uri.location}}
          </p>
          <h5>{{ $t('common.publicKey') }}</h5>
          <p>{{ tal.publicKey }}</p>
          <h5>{{ $t('repository.general.loadedCer') }}</h5>
          <json-object :object="tal.loadedCer"></json-object>
        </b-card>
      </b-col>
      <b-col cols="4">
        <b-card :title="$t('repository.files.title')">
          <b-container>
            <b-row class="text-center h5">
              <b-col></b-col>
              <b-col>{{ $t('repository.files.valid') }}</b-col>
              <b-col>{{ $t('repository.files.warning') }}</b-col>
              <b-col>{{ $t('repository.files.error') }}</b-col>
              <b-col>{{ $t('repository.files.total') }}</b-col>
            </b-row>
            <b-row :class="{ 'text-center': true, 'font-weight-bold': index === filesSummary.size - 1}"
                   v-for="(fileSummary, index) in Array.from(filesSummary)" :key="fileSummary[0]">
              <b-col class="text-right h5">{{fileSummary[0]}}</b-col>
              <b-col class="border">{{fileSummary[1].valid}}</b-col>
              <b-col class="border">{{fileSummary[1].warning}}</b-col>
              <b-col class="border">{{fileSummary[1].error}}</b-col>
              <b-col class="border font-weight-bold">
                {{fileSummary[1].valid + fileSummary[1].warning + fileSummary[1].error}}
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
    </b-row>
    <b-col>
      <b-row>
        <b-button @click="back">{{ $t('general.return') }}</b-button>
      </b-row>
    </b-col>
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
      tal: null,
      error: null,
      loading: false
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  methods: {
    back () {
      this.$router.back()
    },
    loadData () {
      this.error = null
      this.loading = true
      let promise = this.promiseCb(null)
      axios.processPromise(promise,
        this.successCb,
        this.errorCb,
        this.finallyCb)
    },
    promiseCb (auth) {
      let service = config.api.services.get.talDetail.replace(
        ':id',
        this.$route.params.talId
      )
      return axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        service,
        auth)
    },
    successCb (response) {
      this.error = null
      this.tal = response.data
    },
    errorCb (error) {
      this.error = error
      this.tal = null
      this.callLogin()
    },
    finallyCb () {
      this.loading = false
    },
    callLogin () {
      this.checkAuth(this.error, this.promiseCb, this.successCb, this.errorCb)
    },
    addToSummaryMap (check, fileMap, property) {
      let split = check.location.split('.')
      let fileType = split[split.length - 1]
      if (!fileMap.has(fileType)) {
        let values = { valid: 0, warning: 0, error: 0 }
        fileMap.set(fileType, values)
      }
      fileMap.get(fileType)[property] += 1
    }
  },
  created: function () {
    this.loadData()
  },
  computed: {
    filesSummary: function () {
      const fileMap = new Map()
      this.tal.validations.filter((v) => {
        return v.status !== 'RUNNING'
      }).map((validation) => {
        validation.checks.passed.map((c) => {
          this.addToSummaryMap(c, fileMap, 'valid')
        })
        validation.checks.warning.map((c) => {
          this.addToSummaryMap(c, fileMap, 'warning')
        })
        validation.checks.error.map((c) => {
          this.addToSummaryMap(c, fileMap, 'error')
        })
        let object = {}
        object.valid = validation.checks.passed.length
        object.warning = validation.checks.warning.length
        object.error = validation.checks.error.length
        object.total = object.valid + object.warning + object.error
        fileMap.set('', object)
      })
      return fileMap
    }
  }
}
</script>

<style>
</style>
