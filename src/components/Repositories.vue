<template>
    <div class="container mt-2 mx-4">
      <h1>{{ $t('repositories.title') }}</h1>
      <p>{{ $t('repositories.description') }}</p>
      <custom-table :items="repositoryList"
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
      repositoryList: [],
      tableFields: [
        {key: 'name', label: 'repositories.name', sortable: true},
        {
          key: 'uris',
          label: 'repositories.uris',
          sortable: true,
          formatter: (value) => {
            let formatted = ''
            for (let i = 0; i < value.length; i++) {
              formatted += value[i].location
              formatted += (i < value.length - 1 ? ',' : '')
            }
            return formatted
          }
        },
        {key: 'action', label: 'repositories.action', sortable: false}
      ],
      searchFilterOpts: [
        { text: 'repositories.name', value: 'name' },
        { text: 'repositories.uris', value: 'uris' }
      ],
      eventHub: null,
      error: null,
      requestedService: null
    }
  },
  methods: {
    successCb (response) {
      if (response.config.method === 'get') {
        this.repositoryList = response.data
      }
    },
    errorCb (error) {
      this.error = error
      // Show the error
    },
    filterFunction (searchFilterOpt, item, regexp) {
      switch (searchFilterOpt) {
        case 'name':
          return item.name.match(regexp)
        case 'uris':
          // Map the values from the obj to search on those values only
          return item.uris.map(function (uri) {
            return uri.location
          }).toString().match(regexp)
        default:
          return item.name.match(regexp) || item.uris.map(function (uri) {
            return uri.location
          }).toString().match(regexp)
      }
    }
  },
  created: function () {
    axios.get(this.$root.$i18n.locale, config.api.services.get.talList, this.successCb, this.errorCb, this.eventHub)
  }
}
</script>

<style>
</style>
