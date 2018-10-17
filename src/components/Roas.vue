<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col>
        <h1>{{ $t('roas.title') }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>{{ $t('roas.description') }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <custom-table :items="loadRoas"
                      :tableFields="tableFields"
                      :filterFunction="filterFunction"
                      :searchFilterOpts="searchFilterOpts"
                      :showDetailButton="true"
                      :error="error"
                      :loading="loading"
                      :tableId="tableId"
                      :ref="tableId"
                      :callLogin="callLogin">
        </custom-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CustomTable from '@/components/common/CustomTable.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  components: {
    'custom-table': CustomTable
  },
  data () {
    return {
      tableId: 'roasTable',
      getListService: config.api.services.get.roaList,
      tableFields: [
        {key: 'asn', label: 'common.asn', sortable: true},
        {key: 'prefix', label: 'common.prefix', sortable: true},
        {key: 'prefixMaxLength', label: 'common.prefixMaxLength', sortable: true},
        {key: 'prefixFamily', label: 'common.prefixFamily', sortable: true},
        {key: 'action', label: 'common.action', sortable: false}
      ],
      searchFilterOpts: [
        { text: 'common.asn', value: 'asn' },
        { text: 'common.prefix', value: 'prefix' },
        { text: 'common.prefixMaxLength', value: 'prefixMaxLength' },
        { text: 'common.prefixFamily', value: 'prefixFamily' }
      ],
      error: null,
      loading: false,
      auth: {}
    }
  },
  methods: {
    loadRoas (ctx) {
      let me = this
      let promise = axios.getPromise(
        axios.methods.get,
        me.$root.$i18n.locale,
        this.getListService,
        me.auth)
      me.loading = true
      return promise.then(function (response) {
        me.error = null
        return response.data
      }).catch(function (error) {
        me.errorCb(error)
        return []
      }).finally(function () {
        me.loading = false
      })
    },
    filterFunction (item, searchFilterOpt, filterItemTxt) {
      var regexp
      try {
        regexp = new RegExp(filterItemTxt, 'i')
      } catch (e) {
        // Wait until the regexp is valid
        return null
      }
      switch (searchFilterOpt) {
        case 'asn':
          return regexp.test(item.asn)
        case 'prefix':
          return item.prefix.match(regexp)
        case 'prefixMaxLength':
          return regexp.test(item.prefixMaxLength)
        case 'prefixFamily':
          return regexp.test(item.prefixFamily)
        default:
          return regexp.test(item.asn) ||
                 item.prefix.match(regexp) ||
                 regexp.test(item.prefixMaxLength) ||
                 regexp.test(item.prefixFamily)
      }
    },
    promiseCb (auth) {
      this.auth = auth
      return axios.getPromise(
        axios.methods.head,
        this.$root.$i18n.locale,
        this.getListService,
        auth)
    },
    successCb (response) {
      this.$refs[this.tableId].refresh()
    },
    errorCb (error) {
      this.error = error
      this.callLogin()
    },
    callLogin () {
      this.checkAuth(this.error, this.promiseCb, this.successCb, this.errorCb)
    }
  }
}
</script>

<style>
</style>
