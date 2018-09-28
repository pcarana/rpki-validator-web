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
        {key: 'asn', label: 'roas.asn', sortable: true},
        {key: 'prefix', label: 'roas.prefix', sortable: true},
        {key: 'prefixMaxLength', label: 'roas.prefixMaxLength', sortable: true},
        {key: 'prefixFamily', label: 'roas.prefixFamily', sortable: true},
        {key: 'action', label: 'roas.action', sortable: false}
      ],
      searchFilterOpts: [
        { text: 'roas.asn', value: 'asn' },
        { text: 'roas.prefix', value: 'prefix' },
        { text: 'roas.prefixMaxLength', value: 'prefixMaxLength' },
        { text: 'roas.prefixFamily', value: 'prefixFamily' }
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
