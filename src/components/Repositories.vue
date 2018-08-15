<template>
    <div class="container mt-2 mx-4">
      <h1>{{ $t('repositories.title') }}</h1>
      <p>{{ $t('repositories.description') }}</p>
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
        <template slot="HEAD_lastSync" slot-scope="data">
          {{ $t(data.label) }}
        </template>
        <template slot="HEAD_action" slot-scope="data">
          {{ $t(data.label) }}
        </template>
        <template slot="uris" slot-scope="data">
          <span v-for="item in data.value" :key="item.value">
            {{ item.value }}<br />
          </span>
        </template>
        <template slot="action" slot-scope="row">
          <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
            {{ $t('repositories.' + (row.detailsShowing ? 'hide' : 'show') + 'Detail')}}
          </b-button>
          <b-button size="sm" class="mr-2">
            {{ $t('repositories.syncOne') }}
          </b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <span v-for="uri in row.item.uris" :key="uri.value">
          <b-card> <!-- v-if="item.loaded">-->
            <b-row class="mb-2">
              <b-col sm="3" class="text-sm-left"><b>{{ $t('repositories.loadedUri') }}:</b></b-col>
              <b-col>{{ uri.value }}</b-col>
            </b-row>
            <b-row class="mb-2">
              <b-col sm="3" class="text-sm-left"><b>{{ $t('repositories.publicKey') }}:</b></b-col>
              <b-col style="word-wrap: break-word">{{ row.item.publicKey }}</b-col>
            </b-row>
            <b-button size="sm" @click="row.toggleDetails">{{ $t('repositories.hideDetail') }}</b-button>
          </b-card>
          </span>
        </template>
      </b-table>
      <b-pagination v-if="totalRows > perPage" size="md" :total-rows="totalRows" :per-page="perPage" v-model="tableCurrentPage" align="center"></b-pagination>
    </div>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      repositoryList: [],
      tableFields : [
        {key: 'name', label: 'repositories.name', sortable: true},
        {key: 'uris', label: 'repositories.uris', sortable: true},
        {key: 'lastSync', label: 'repositories.lastSync', sortable: true},
        {key: 'action', label: 'repositories.action', sortable: false}
      ],
      tableCurrentPage : 1,
      totalRows: 0,
      perPage: 4,
      searchFilterOpts: [
        { text: 'All', value: null },
        { text: 'Name', value: 'name' }
      ],
      searchFilter: null,
      filterItem: null,
      eventHub: null
    }
  },
  methods: {
    successCb (response) {
      this.repositoryList = response.data
    },
    errorCb (error) {
      this.result = error
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
        return true;
      }
      /*switch (searchFilterOpt) {
        case 'name':
          return item.name.match(regexp);
        case 'lastName':
          return item.lastName.match(regexp);
        case 'flightType':
          return item.flightType.toString().match(regexp);
        default:
          return item.name.match(regexp) || item.lastName.match(regexp) || item.flightType.toString().match(regexp);
      }*/
      return item.name.match(regexp)
    }
  },
  created: function () {
    axios.get(this.$root.$i18n.locale, config.api.services.get.talList, this.successCb, this.errorCb, this.eventHub)
  }
}
</script>

<style>
</style>
