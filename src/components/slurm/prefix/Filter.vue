<template>
  <b-container class="mt-2 mx-4">
    <custom-table :items="filtersList"
                  :tableFields="tableFields"
                  :filterFunction="filterFunction"
                  :searchFilterOpts="searchFilterOpts"
                  :showDetailButton="true">
    </custom-table>
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
      filtersList: [],
      tableFields: [
        { key: 'asn', label: 'common.asn', sortable: true },
        { key: 'prefix', label: 'common.prefix', sortable: true },
        { key: 'comment', label: 'common.comment', sortable: false },
        { key: 'action', label: 'common.action', sortable: false }
      ],
      searchFilterOpts: [
        { text: 'common.asn', value: 'asn' },
        { text: 'common.prefix', value: 'prefix' },
        { text: 'common.comment', value: 'comment' }
      ],
      eventHub: null,
      error: null,
      requestedService: null
    }
  },
  methods: {
    successCb (response) {
      this.filtersList = response.data
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
        case 'comment':
          return item.comment.match(regexp)
        default:
          return regexp.test(item.asn) ||
                 item.prefix.match(regexp) ||
                 item.comment.match(regexp)
      }
    }
  },
  created: function () {
    axios.get(this.$root.$i18n.locale,
      config.api.services.get.slurmPrefixFilterList,
      this.successCb,
      this.errorCb,
      this.eventHub)
  }
}
</script>

<style>
</style>
