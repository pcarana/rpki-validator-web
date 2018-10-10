<template>
  <b-container class="mt-2 mx-4">
    <custom-table :items="loadAssertions"
                  :tableFields="tableFields"
                  :filterFunction="filterFunction"
                  :searchFilterOpts="searchFilterOpts"
                  :showDeleteButton="true"
                  :deleteCallback="confirmDelete"
                  :error="error"
                  :loading="loading"
                  :tableId="tableId">
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
      tableId: 'assertionTable',
      postService: config.api.services.post.slurmPrefixAssertion,
      confirmDeleteModalId: 'confirmDelete',
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
      error: null,
      loading: false,
      deleteItem: null
    }
  },
  methods: {
    loadAssertions () {
      let me = this
      let promise = axios.getAsPromise(me.$root.$i18n.locale, config.api.services.get.slurmPrefixAssertionList)
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
      this.$root.$emit('bv::refresh::table', this.tableId)
    },
    deleteSuccessCb (response) {
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
