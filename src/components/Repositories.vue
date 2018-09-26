<template>
    <div class="container mt-2 mx-4">
      <h1>{{ $t('repositories.title') }}</h1>
      <p>{{ $t('repositories.description') }}</p>
      <b-row align-h="between">
        <b-col cols="6">
          <b-form-group horizontal>
            <b-input-group>
              <b-input-group-prepend>
                <b-form-select id="searchFilter" v-model="searchFilter">
                  <option v-for="opt in searchFilterOpts" :key="opt.value" :value="opt.value">
                    {{ $t(opt.text) }}
                  </option>
                </b-form-select>
              </b-input-group-prepend>
              <b-form-input v-model="filterItem" :placeholder="$t('filter.placeholder')"></b-form-input>
              <b-input-group-append>
                <b-btn :disabled="!customFilter" @click="filterItem = ''" variant="outline-primary">{{ $t('filter.clean') }}</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group horizontal label-for="maxPerPage" :label="$t('general.maxResults')">
            <b-form-select id="maxPerPage" v-model="perPage" :options="resultsPerPageOpts"></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-table striped hover responsive show-empty
        :items="repositoryList"
        :fields="tableFields"
        :per-page="perPage"
        :total-rows="totalRows"
        :current-page="tableCurrentPage"
        :filter="customFilter"
        @filtered="onFiltered"
        :empty-filtered-text="$t('errors.noDataFound')">
        <template slot="HEAD_name" slot-scope="data">
          {{ $t(data.label) }}
        </template>
        <template slot="HEAD_uris" slot-scope="data">
          {{ $t(data.label) }}
        </template>
        <template slot="HEAD_action" slot-scope="data">
          {{ $t(data.label) }}
        </template>
        <template slot="uris" slot-scope="data">
          <span v-for="item in data.value" :key="item.location">
            {{ item.location }}<br />
          </span>
        </template>
        <template slot="action" slot-scope="row">
          <b-button size="sm" class="mr-2" :to="{path: ''+row.item.id}" append>
            {{ $t('repositories.showDetail') }}
          </b-button>
        </template>
      </b-table>
      <b-pagination v-if="totalRows > perPage" size="md" :total-rows="totalRows" :per-page="perPage" v-model="tableCurrentPage" align="center"></b-pagination>
      <p v-if="totalRows > perPage">{{ $t('general.displaying', {display: perPage, total: totalRows}) }}</p>
    </div>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      repositoryList: [],
      tableFields: [
        {key: 'name', label: 'repositories.name', sortable: true},
        {key: 'uris', label: 'repositories.uris', sortable: true},
        {key: 'action', label: 'repositories.action', sortable: false}
      ],
      tableCurrentPage: 1,
      totalRows: 0,
      perPage: 10,
      searchFilterOpts: [
        { text: 'filter.all', value: null },
        { text: 'repositories.name', value: 'name' },
        { text: 'repositories.uris', value: 'uris' }
      ],
      searchFilter: null,
      filterItem: null,
      resultsPerPageOpts: [
        { text: 10, value: 10 },
        { text: 25, value: 25 },
        { text: 50, value: 50 },
        { text: 100, value: 100 }
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
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.tableCurrentPage = 1
    },
    customFilter (item) {
      var searchFilterOpt = this.searchFilter === null ? '' : this.searchFilter.trim()
      var filterItemTxt = this.filterItem === null ? '' : this.filterItem.trim()
      try {
        var regexp = new RegExp(filterItemTxt, 'i')
      } catch (e) {
        // Wait until the regexp is valid
        return true
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
  },
  created: function () {
    axios.get(this.$root.$i18n.locale, config.api.services.get.talList, this.successCb, this.errorCb, this.eventHub)
  }
}
</script>

<style>
</style>
