<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="10">
        <loading :show="loading"></loading>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="10">
        <error-display :error="error"></error-display>
      </b-col>
    </b-row>
    <b-row align-h="between">
      <b-col cols="5" align-self="start">
        <b-input-group>
          <b-input-group-prepend>
            <b-form-select id="searchFilter" v-model="searchFilter">
              <option value=null>
                {{ $t('filter.all') }}
              </option>
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
      </b-col>
      <b-col cols="2">
        <b-form-select id="maxPerPage" v-model="perPage" :options="resultsPerPageOpts">
          <template slot="first">
            <option :value="null" disabled>-- {{ $t('general.maxResults') }} --</option>
          </template>
        </b-form-select>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-table striped hover responsive show-empty
          :id="tableId"
          :items="items"
          :fields="tableFields"
          :per-page="perPage"
          :total-rows="totalRows"
          :current-page="tableCurrentPage"
          :filter="customFilter"
          @filtered="onFiltered"
          :empty-filtered-text="$t('errors.noDataFound')"
          no-provider-paging
          no-provider-sorting
          no-provider-filtering>
          <template v-for="field in tableFields" :slot="'HEAD_' + field.key" slot-scope="data">
            {{ $t(data.label) }}
          </template>
          <template v-if="showDetailButton || showDeleteButton" slot="action" slot-scope="row">
            <b-button size="sm" class="mr-2" :to="{path: ''+row.item.id}" append v-if="showDetailButton">
              {{ $t('general.showDetail') }}
            </b-button>
            <b-button size="sm" class="mr-2" variant="outline-danger" @click="deleteCallback(row.item)" append v-if="showDeleteButton">
              {{ $t('common.delete') }}
            </b-button>
          </template>
          <template slot="table-caption">
            <p v-if="totalRows > perPage">
              {{ $t('general.displaying', {from: fromResult, to: toResult, total: totalRows}) }}
            </p>
          </template>
        </b-table>
        <b-pagination v-if="totalRows > perPage" size="md" :total-rows="totalRows"
                      :per-page="perPage" v-model="tableCurrentPage" align="center">
        </b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import Loading from '@/components/common/Loading.vue'

export default {
  props: {
    items: [Array, Function],
    tableFields: Array,
    filterFunction: Function,
    searchFilterOpts: Array,
    showDetailButton: {
      type: Boolean,
      default: false
    },
    showDeleteButton: {
      type: Boolean,
      default: false
    },
    deleteCallback: Function,
    error: [Object, Error],
    loading: Boolean,
    tableId: String
  },
  data () {
    return {
      tableCurrentPage: 1,
      totalRows: 0,
      perPage: 10,
      searchFilter: null,
      filterItem: null,
      resultsPerPageOpts: [
        { text: 10, value: 10 },
        { text: 25, value: 25 },
        { text: 50, value: 50 },
        { text: 100, value: 100 }
      ]
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.tableCurrentPage = 1
    },
    customFilter (item) {
      var searchFilterOpt = this.searchFilter === null ? '' : this.searchFilter.trim()
      var filterItemTxt = this.filterItem === null ? '' : this.filterItem.trim()
      return this.filterFunction(item, searchFilterOpt, filterItemTxt)
    }
  },
  computed: {
    fromResult: function () {
      return (this.tableCurrentPage - 1) * this.perPage + 1
    },
    toResult: function () {
      let toResult = this.tableCurrentPage * this.perPage
      if (toResult < this.totalRows) {
        return toResult
      }
      return this.totalRows
    }
  }
}
</script>

<style>
</style>
