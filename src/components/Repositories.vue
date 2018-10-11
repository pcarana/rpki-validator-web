<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col>
        <h1>{{ $t('repositories.title') }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>{{ $t('repositories.description') }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <custom-table :items="loadTals"
                      :tableFields="tableFields"
                      :filterFunction="filterFunction"
                      :searchFilterOpts="searchFilterOpts"
                      :showDetailButton="true"
                      :error="error"
                      :loading="loading"
                      tableId="repositoriesTable">
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
        {key: 'action', label: 'common.action', sortable: false}
      ],
      searchFilterOpts: [
        { text: 'repositories.name', value: 'name' },
        { text: 'repositories.uris', value: 'uris' }
      ],
      error: null,
      loading: false
    }
  },
  methods: {
    loadTals (ctx) {
      let me = this
      let promise = axios.getAsPromise(me.$root.$i18n.locale, config.api.services.get.talList)
      me.loading = true
      return promise.then(function (response) {
        me.error = null
        return response.data
      }).catch(function (error) {
        me.error = error
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
  }
}
</script>

<style>
</style>
