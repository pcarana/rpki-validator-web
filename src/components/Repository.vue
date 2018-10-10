<template>
    <div class="container mt-2 mx-4">
      <h1>{{ $t('repository.title', { name: tal.name }) }}</h1>
      <p v-if="error">{{ error }}</p>
      <h2>Detail</h2>
      <h3>URIs</h3>
      <p v-for="uri in tal.uris" :key="uri.location">
        {{ uri.location}}
      </p>
      <h3>Public key</h3>
      <p>{{ tal.publicKey }}</p>
      <h3>Loaded certificate</h3>
      <b-container>
        <json-object :object="tal.loadedCer"></json-object>
      </b-container>
      <h3>Files summary</h3>
      <b-container>
        <b-row>
          <b-col></b-col>
          <b-col>Valid</b-col>
          <b-col>Warning</b-col>
          <b-col>Error</b-col>
          <b-col>Total</b-col>
        </b-row>
        <b-row v-for="fileSummary in Array.from(filesSummary)" :key="fileSummary[0]">
          <b-col>{{fileSummary[0]}}</b-col>
          <b-col>{{fileSummary[1].valid}}</b-col>
          <b-col>{{fileSummary[1].warning}}</b-col>
          <b-col>{{fileSummary[1].error}}</b-col>
          <b-col>{{fileSummary[1].valid + fileSummary[1].warning + fileSummary[1].error}}</b-col>
        </b-row>
      </b-container>
      <b-button @click="back">{{ $t('general.return') }}</b-button>
    </div>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
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
    const service = config.api.services.get.talDetail.replace(
      ':id',
      this.$route.params.talId
    )
    axios.get(
      this.$root.$i18n.locale,
      service,
      this.successCb,
      this.errorCb
    )
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
