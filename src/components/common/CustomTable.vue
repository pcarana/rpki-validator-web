<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="10">
        <loading :show="loading"></loading>
        <error-display :error="error || additionalError" :callLogin="callLogin" :callRetry="refresh"></error-display>
      </b-col>
    </b-row>
    <b-row align-h="between">
      <b-col cols="5" align-self="start">
        <b-input-group>
          <b-input-group-prepend>
            <b-form-select id="searchFilter" v-model="searchFilter">
              <option :value=null>
                {{ listService ? $t('filter.select') : $t('filter.all') }}
              </option>
              <option v-for="opt in searchFilterOpts" :key="opt.value" :value="opt.value">
                {{ $t(opt.text) }}
              </option>
            </b-form-select>
          </b-input-group-prepend>
          <b-form-input v-model="filterItem" :placeholder="$t('filter.placeholder')"></b-form-input>
          <b-input-group-append>
            <b-btn :disabled="listService ? !filterItem : !customFilter"
                   @click="filterItem = ''"
                   variant="outline-primary">
              {{ $t('filter.clean') }}
            </b-btn>
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
          :ref="tableId"
          :items="listService ? loadItems : items"
          :fields="tableFields"
          :per-page="perPage"
          :total-rows="totalRows"
          :current-page="tableCurrentPage"
          :filter="listService ? filterItem : customFilter"
          @filtered="onFiltered"
          :empty-filtered-text="$t('errors.noDataFound')"
          :no-provider-paging = "!listService"
          :no-provider-sorting = "!listService"
          :no-provider-filtering = "!listService">
          <template v-for="field in tableFields" :slot="'HEAD_' + field.key" slot-scope="data">
            {{ $t(data.label) }}
          </template>
          <template v-if="showDetailButton || showDeleteButton || showAdditionalAction" slot="action" slot-scope="row">
            <b-button size="sm" class="mr-2" :to="{path: ''+row.item.id}" append v-if="showDetailButton">
              {{ $t('general.showDetail') }}
            </b-button>
            <b-button :id="additionalAction.buttonRef + row.item.id"
                      :ref="additionalAction.buttonRef + row.item.id"
                      size="sm"
                      class="mr-2"
                      variant="secondary"
                      @click="additionalAction.onClick(row.item)"
                      append
                      v-if="showAdditionalAction">
              {{ $t(additionalAction.label) }}
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
import axios from '@/axios'

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
    showAdditionalAction: {
      type: Boolean,
      default: false
    },
    additionalAction: {
      type: Object,
      default: function () {
        return {
          onClick: (itemId) => {},
          label: '',
          buttonRef: ''
        }
      }
    },
    additionalError: {
      type: [Object, Error],
      default: null
    },
    deleteCallback: Function,
    tableId: String,
    callLogin: Function,
    listService: {
      type: String,
      default: null
    },
    context: Object,
    errorCb: Function
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
      ],
      error: null,
      loading: false
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
    },
    refresh () {
      this.$root.$emit('bv::refresh::table', this.tableId)
    },
    loadItems (ctx) {
      let me = this
      let callerCtx = me.context
      let myAxios = axios.createAxios(me.$root.$i18n.locale)
      let myParams = {}
      axios.setToken(myAxios, callerCtx.useToken)
      if (me.searchFilter && me.filterItem && me.searchFilter.trim().length > 0 && me.filterItem.trim().length > 0) {
        myParams.filterQuery = me.filterItem.trim()
        myParams.filterField = me.searchFilter.trim()
      }
      myParams.limit = ctx.perPage
      myParams.offset = (ctx.currentPage - 1) * ctx.perPage
      if (ctx.sortBy) {
        myParams.sort = (ctx.sortDesc ? '-' : '+') + ctx.sortBy
      }
      me.loading = true
      me.error = null
      return myAxios.get(me.listService, {
        params: myParams
      }).then(function (response) {
        let data = response.data
        me.totalRows = data.found
        return data.results
      }).catch(function (error) {
        me.errorCb(error)
        me.error = error
        me.tableCurrentPage = 1
        return []
      }).finally(function () {
        me.loading = false
      })
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
  },
  watch: {
    filterItem: function (newVal, oldVal) {
      this.tableCurrentPage = 1
    },
    perPage: function (newVal, oldVal) {
      if (this.tableCurrentPage > 1) {
        let currStart = (this.tableCurrentPage - 1) * oldVal
        this.tableCurrentPage = Math.floor(currStart / newVal) + 1
      }
    }
  }
}
</script>

<style>
</style>
