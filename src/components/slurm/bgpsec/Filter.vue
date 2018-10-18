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
                      :tableId="tableId"
                      :ref="tableId"
                      :callLogin="callLogin">
        </custom-table>
      </b-col>
    </b-row>
    <add-bgpsec :successCallback="actionSuccessCb"
                bgpsecType="filter"
                addButtonLabel="slurm.filter.addNew"
                :postService="postService">
    </add-bgpsec>
    <delete-object :id="confirmDeleteModalId"
                   :successCallback="actionSuccessCb"
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
      tableId: 'filterTable',
      postService: config.api.services.post.slurmBgpsecFilter,
      getListService: config.api.services.get.slurmBgpsecFilterList,
      confirmDeleteModalId: 'confirmDelete',
      tableFields: [
        { key: 'asn', label: 'common.asn', sortable: true },
        {
          key: 'SKI',
          label: 'common.ski',
          sortable: true,
          formatter: (value) => {
            if (value && value !== null) {
              return atob(value)
            }
            return ''
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
      loading: false,
      deleteItem: null,
      auth: {}
    }
  },
  methods: {
    loadFilters () {
      let me = this
      let promise = axios.getPromise(
        axios.methods.get,
        me.$root.$i18n.locale,
        this.getListService,
        me.auth)
      me.loading = true
      me.error = null
      return promise.then(function (response) {
        return response.data
      }).catch(function (error) {
        me.errorCb(error)
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
    promiseCb (auth) {
      this.auth = auth
      return axios.getPromise(
        axios.methods.head,
        this.$root.$i18n.locale,
        this.getListService,
        auth)
    },
    actionSuccessCb (response) {
      this.$refs[this.tableId].refresh()
    },
    errorCb (error) {
      this.error = error
      this.callLogin()
    },
    callLogin () {
      this.checkAuth(this.error, this.promiseCb, this.actionSuccessCb, this.errorCb)
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
