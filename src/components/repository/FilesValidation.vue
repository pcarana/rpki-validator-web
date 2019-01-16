<template>
  <b-container fluid>
    <b-row class="mb-4">
      <b-col>
        <loading :show="loading"></loading>
        <error-display :error="error" :callLogin="callLogin" :callRetry="loadData"></error-display>
      </b-col>
    </b-row>
    <b-row v-if="validationSummary" class="mb-4">
      <b-col cols="2"></b-col>
      <b-col cols="8">
        <b-container fluid>
          <b-row class="text-center h5">
            <b-col cols="12">
              {{ $t('repository.files.title') }}
            </b-col>
          </b-row>
          <b-row class="text-center h5">
            <b-col></b-col>
            <b-col>
              <b-badge variant="success">
                {{ $t('repository.files.valid') }}
              </b-badge>
            </b-col>
            <b-col>
              <b-badge variant="warning">
                {{ $t('repository.files.warning') }}
              </b-badge>
            </b-col>
            <b-col>
              <b-badge variant="danger">
                {{ $t('repository.files.error') }}
              </b-badge>
            </b-col>
            <b-col>
              <b-badge variant="dark">
                {{ $t('repository.files.total') }}
              </b-badge>
            </b-col>
          </b-row>
          <b-row class='text-center' v-for="(value, fileType) in localSummary" :key="fileType">
            <b-col class="text-right h6">
              {{ fileType }}
            </b-col>
            <b-col class="border">{{ localSummary[fileType].passed }}</b-col>
            <b-col class="border">{{ localSummary[fileType].warning }}</b-col>
            <b-col class="border">{{ localSummary[fileType].error }}</b-col>
            <b-col class="border font-weight-bold">{{ localSummary[fileType].total }}</b-col>
          </b-row>
          <b-row class='text-center font-weight-bold'>
            <b-col class="text-right h6"></b-col>
            <b-col class="border">{{ totalByStatus('passed') }}</b-col>
            <b-col class="border">{{ totalByStatus('warning') }}</b-col>
            <b-col class="border">{{ totalByStatus('error') }}</b-col>
            <b-col class="border font-weight-bold">{{ totalByStatus('total') }}</b-col>
          </b-row>
        </b-container>
      </b-col>
      <b-col cols="2"></b-col>
    </b-row>
    <b-row v-else class="mb-4 p-4 font-italic">
      <h5>{{ $t('repository.files.noData') }}</h5>
    </b-row>
    <b-row>
      <b-col cols="12">
        <custom-table :tableFields="tableFields"
                      :searchFilterOpts="searchFilterOpts"
                      :tableId="tableId"
                      :ref="tableId"
                      :listService="getListService"
                      :callLogin="callLogin"
                      :errorCb="errorCb"
                      :context="this">
        </custom-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CustomTable from '@/components/common/CustomTable.vue'
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import Loading from '@/components/common/Loading.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  props: {
    tal: {
      type: Object,
      default: null
    }
  },
  components: {
    'custom-table': CustomTable,
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  data () {
    return {
      tableId: 'validationsTable',
      tableFields: [
        { key: 'fileType', label: 'repository.validations.fileType', sortable: true },
        { key: 'location', label: 'repository.validations.location', sortable: true },
        { key: 'status', label: 'repository.validations.status', sortable: true },
        { key: 'message', label: 'repository.validations.message', sortable: false }
      ],
      searchFilterOpts: [
        { value: 'fileType', text: 'repository.validations.fileType' },
        { value: 'location', text: 'repository.validations.location' },
        { value: 'status', text: 'repository.validations.status' }
      ],
      loading: false,
      useToken: false,
      error: null,
      validationSummary: null,
      localSummary: {
        cer: { passed: 0, warning: 0, error: 0, total: 0 },
        crl: { passed: 0, warning: 0, error: 0, total: 0 },
        roa: { passed: 0, warning: 0, error: 0, total: 0 },
        mft: { passed: 0, warning: 0, error: 0, total: 0 },
        gbr: { passed: 0, warning: 0, error: 0, total: 0 }
      },
      getListService: config.api.services.get.talValidationList.replace(
        ':id',
        this.tal.id
      )
    }
  },
  methods: {
    totalByStatus (status) {
      let total = 0
      for (let fileType in this.localSummary) {
        total += this.localSummary[fileType][status]
      }
      return total
    },
    loadData (useToken) {
      this.error = null
      this.loading = true
      this.useToken = useToken
      let service = this.getListService
      let promise = axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        service,
        useToken,
        {summary: true})
      axios.processPromise(promise,
        this.successCb,
        this.errorCb,
        this.finallyCb)
    },
    successCb (response) {
      this.error = null
      this.validationSummary = response.data
      this.localSummary = {
        cer: { passed: 0, warning: 0, error: 0, total: 0 },
        crl: { passed: 0, warning: 0, error: 0, total: 0 },
        roa: { passed: 0, warning: 0, error: 0, total: 0 },
        mft: { passed: 0, warning: 0, error: 0, total: 0 },
        gbr: { passed: 0, warning: 0, error: 0, total: 0 }
      }
      let vs = this.validationSummary
      if (vs) {
        for (let status in vs) {
          for (let fileType in vs[status]) {
            this.localSummary[fileType][status] = vs[status][fileType]
            this.localSummary[fileType].total += vs[status][fileType]
          }
        }
      }
      this.$refs[this.tableId].refresh()
    },
    errorCb (error) {
      this.error = error
      this.validationSummary = null
      this.callLogin()
    },
    finallyCb () {
      this.loading = false
    },
    retryCb (useToken) {
      this.useToken = useToken
      this.$refs[this.tableId].refresh()
    },
    callLogin () {
      this.checkAuth(this.error, this.retryCb, this.errorCb)
    }
  },
  created: function () {
    this.loadData(this.useToken)
  },
  watch: {
    tal: function (val, oldVal) {
      this.getListService = config.api.services.get.talValidationList.replace(
        ':id',
        val.id
      )
      this.loadData(this.useToken)
      return val
    }
  }
}
</script>

<style>
</style>
