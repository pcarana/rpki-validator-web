<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <custom-table :items="loadFilters"
                      :tableFields="tableFields"
                      :filterFunction="filterFunction"
                      :searchFilterOpts="searchFilterOpts"
                      :showDeleteButton="true"
                      :deleteCallback="confirmDelete"
                      :error="error"
                      :loading="loading"
                      :tableId="tableId">
        </custom-table>
      </b-col>
    </b-row>
    <add-prefix :successCallback="actionSuccessCb"
                prefixType="filter"
                addButtonLabel="slurm.filter.addNew"
                :postService="postService">
    </add-prefix>
    <delete-object :id="confirmDeleteModalId"
                   :successCallback="actionSuccessCb"
                   type="prefix"
                   :item="deleteItem">
    </delete-object>
  </b-container>
</template>

<script>
import AddPrefix from '@/components/slurm/prefix/AddPrefix.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import DeleteObject from '@/components/slurm/DeleteObject.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  components: {
    'add-prefix': AddPrefix,
    'custom-table': CustomTable,
    'delete-object': DeleteObject
  },
  data () {
    return {
      tableId: 'filterTable',
      postService: config.api.services.post.slurmPrefixFilter,
      confirmDeleteModalId: 'confirmDelete',
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
      error: null,
      loading: false,
      deleteItem: null
    }
  },
  methods: {
    loadFilters () {
      let me = this
      let promise = axios.getAsPromise(me.$root.$i18n.locale, config.api.services.get.slurmPrefixFilterList)
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
    },
    actionSuccessCb (response) {
      this.$root.$emit('bv::refresh::table', this.tableId)
    },
    confirmDelete (item) {
      this.deleteItem = item
      this.$root.$emit('bv::show::modal', this.confirmDeleteModalId)
    }
  }
}
</script>

<style>
</style>
