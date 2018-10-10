<template>
  <b-container class="mt-2 mx-4">
    <custom-table :items="filtersList"
                  :tableFields="tableFields"
                  :filterFunction="filterFunction"
                  :searchFilterOpts="searchFilterOpts"
                  :showDeleteButton="true"
                  :deleteCallback="confirmDelete">
    </custom-table>
    <add-prefix :successCallback="createSuccessCb"
                prefixType="filter"
                addButtonLabel="slurm.filter.addNew"
                :postService="postService">
    </add-prefix>
    <delete-object :id="confirmDeleteModalId"
                   :successCallback="deleteSuccessCb"
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
      postService: config.api.services.post.slurmPrefixFilter,
      confirmDeleteModalId: 'confirmDelete',
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
      error: null,
      deleteItem: null
    }
  },
  methods: {
    loadList () {
      axios.get(this.$root.$i18n.locale,
        config.api.services.get.slurmPrefixFilterList,
        this.successCb,
        this.errorCb)
    },
    successCb (response) {
      this.filtersList = response.data
    },
    errorCb (error) {
      this.error = error
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
    createSuccessCb (response) {
      this.loadList()
    },
    deleteSuccessCb (response) {
      this.loadList()
    },
    confirmDelete (item) {
      this.deleteItem = item
      this.$root.$emit('bv::show::modal', this.confirmDeleteModalId)
    }
  },
  created: function () {
    this.loadList()
  }
}
</script>

<style>
</style>
