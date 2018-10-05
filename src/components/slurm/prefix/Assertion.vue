<template>
  <b-container class="mt-2 mx-4">
    <custom-table :items="assertionsList"
                  :tableFields="tableFields"
                  :filterFunction="filterFunction"
                  :searchFilterOpts="searchFilterOpts"
                  :showDeleteButton="true"
                  :deleteCallback="confirmDelete">
    </custom-table>
    <add-prefix :successCallback="createSuccessCb"
                prefixType="assertion"
                addButtonLabel="slurm.assertion.addNew"
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
      postService: config.api.services.post.slurmPrefixAssertion,
      confirmDeleteModalId: 'confirmDelete',
      assertionsList: [],
      tableFields: [
        { key: 'asn', label: 'common.asn', sortable: true },
        { key: 'prefix', label: 'common.prefix', sortable: true },
        { key: 'maxPrefixLength', label: 'common.prefixMaxLength', sortable: true },
        { key: 'comment', label: 'common.comment', sortable: false },
        { key: 'action', label: 'common.action', sortable: false }
      ],
      searchFilterOpts: [
        { text: 'common.asn', value: 'asn' },
        { text: 'common.prefix', value: 'prefix' },
        { text: 'common.prefixMaxLength', value: 'maxPrefixLength' },
        { text: 'common.comment', value: 'comment' }
      ],
      eventHub: null,
      error: null,
      deleteItem: null
    }
  },
  methods: {
    loadList () {
      axios.get(this.$root.$i18n.locale,
        config.api.services.get.slurmPrefixAssertionList,
        this.successCb,
        this.errorCb,
        this.eventHub)
    },
    successCb (response) {
      this.assertionsList = response.data
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
        case 'maxPrefixLength':
          return regexp.test(item.maxPrefixLength)
        case 'comment':
          return item.comment.match(regexp)
        default:
          return regexp.test(item.asn) ||
                 item.prefix.match(regexp) ||
                 regexp.test(item.maxPrefixLength) ||
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
