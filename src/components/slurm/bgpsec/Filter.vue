<template>
  <b-container class="mt-2 mx-4">
    <custom-table :items="filtersList"
                  :tableFields="tableFields"
                  :filterFunction="filterFunction"
                  :searchFilterOpts="searchFilterOpts"
                  :showDeleteButton="true"
                  :deleteCallback="confirmDelete">
    </custom-table>
    <add-bgpsec :successCallback="createSuccessCb"
                bgpsecType="filter"
                addButtonLabel="slurm.filter.addNew"
                :postService="postService">
    </add-bgpsec>
    <delete-object :id="confirmDeleteModalId"
                   :successCallback="deleteSuccessCb"
                   type="bgpsec"
                   :item="deleteItem">
    </delete-object>
  </b-container>
</template>

<script>
import AddBgpsec from '@/components/slurm/bgpsec/AddBgpsec.vue'
import CustomTable from '@/components/common/CustomTable.vue'
import DeleteObject from '@/components/slurm/DeleteObject.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  components: {
    'add-bgpsec': AddBgpsec,
    'custom-table': CustomTable,
    'delete-object': DeleteObject
  },
  data () {
    return {
      postService: config.api.services.post.slurmBgpsecFilter,
      confirmDeleteModalId: 'confirmDelete',
      filtersList: [],
      tableFields: [
        { key: 'asn', label: 'common.asn', sortable: true },
        {
          key: 'SKI',
          label: 'common.ski',
          sortable: true,
          formatter: (value) => {
            return atob(value)
          }
        },
        { key: 'comment', label: 'common.comment', sortable: false },
        { key: 'action', label: 'common.action', sortable: false }
      ],
      searchFilterOpts: [
        { text: 'common.asn', value: 'asn' },
        { text: 'common.ski', value: 'SKI' },
        { text: 'common.comment', value: 'comment' }
      ],
      error: null,
      deleteItem: null
    }
  },
  methods: {
    loadList () {
      axios.get(this.$root.$i18n.locale,
        config.api.services.get.slurmBgpsecFilterList,
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
        case 'ski':
          return item.SKI.match(regexp)
        case 'comment':
          return item.comment.match(regexp)
        default:
          return regexp.test(item.asn) ||
                 item.SKI.match(regexp) ||
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
