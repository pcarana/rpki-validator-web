<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <custom-table :items="loadAssertions"
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
    <add-prefix :successCallback="actionSuccessCb"
                prefixType="assertion"
                addButtonLabel="slurm.assertion.addNew"
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
      tableId: 'assertionTable',
      postService: config.api.services.post.slurmPrefixAssertion,
      getListService: config.api.services.get.slurmPrefixAssertionList,
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
      deleteItem: null,
      auth: {}
    }
  },
  methods: {
    loadAssertions () {
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
