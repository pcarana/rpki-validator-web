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
        <custom-table :tableFields="tableFields"
                      :searchFilterOpts="searchFilterOpts"
                      :showDetailButton="true"
                      :tableId="tableId"
                      :ref="tableId"
                      :callLogin="callLogin"
                      :listService="getListService"
                      :context="this"
                      :errorCb="errorCb">
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
        {key: 'prefixMaxLength', label: 'common.prefixMaxLength', sortable: false},
        {key: 'prefixFamily', label: 'common.prefixFamily', sortable: false},
        {key: 'action', label: 'common.action', sortable: false}
      ],
      searchFilterOpts: [
        { text: 'common.asn', value: 'asn' },
        { text: 'common.prefix', value: 'prefix' }
      ],
      auth: {}
    }
  },
  methods: {
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
