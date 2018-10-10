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
    <add-bgpsec :successCallback="createSuccessCb"
                bgpsecType="assertion"
                addButtonLabel="slurm.assertion.addNew"
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
      tableId: 'assertionTable',
      postService: config.api.services.post.slurmBgpsecAssertion,
      confirmDeleteModalId: 'confirmDelete',
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
        {
          key: 'routerPublicKey',
          label: 'common.routerPublicKey',
          sortable: false,
          formatter: (value) => {
            return value && value.length > 20 ? value.substr(0, 20).concat('...') : value
          }
        },
        { key: 'comment', label: 'common.comment', sortable: false },
        { key: 'action', label: 'common.action', sortable: false }
      ],
      searchFilterOpts: [
        { text: 'common.asn', value: 'asn' },
        { text: 'common.ski', value: 'ski' },
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
      let promise = axios.getAsPromise(me.$root.$i18n.locale, config.api.services.get.slurmBgpsecAssertionList)
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
