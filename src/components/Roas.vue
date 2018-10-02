<template>
    <div class="container mt-2 mx-4">
      <h1>{{ $t('roas.title') }}</h1>
      <p>{{ $t('roas.description') }}</p>
      <custom-table :items="roasList"
                    :tableFields="tableFields"
                    :filterFunction="filterFunction"
                    :searchFilterOpts="searchFilterOpts"
                    :showDetailButton="true">
      </custom-table>
    </div>
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
      roasList: [],
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
      eventHub: null,
      error: null,
      requestedService: null
    }
  },
  methods: {
    successCb (response) {
      this.roasList = response.data
    },
    errorCb (error) {
      this.error = error
      // Show the error
    },
    filterFunction (item, searchFilterOpt, filterItemTxt) {
      var regexp
      try {
        regexp = new RegExp(filterItemTxt, 'i')
      } catch (e) {
        // Wait until the regexp is valid
        return true
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
    }
  },
  created: function () {
    axios.get(this.$root.$i18n.locale, config.api.services.get.roaList, this.successCb, this.errorCb, this.eventHub)
  }
}
</script>

<style>
</style>
