<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <custom-table :tableFields="tableFields"
                      :searchFilterOpts="searchFilterOpts"
                      :showDeleteButton="true"
                      :deleteCallback="confirmDelete"
                      :ref="tableId"
                      :tableId="tableId"
                      :callLogin="callLogin"
                      :listService="getListService"
                      :context="this"
                      :errorCb="errorCb">
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
      confirmDeleteModalId: 'confirmFilterDelete',
      tableFields: [
        { key: 'asn', label: 'common.asn', sortable: true },
        {
          key: 'SKI',
          label: 'common.ski',
          sortable: false,
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
        { text: 'common.asn', value: 'asn' }
      ],
      deleteItem: null,
      useToken: false,
      error: null
    }
  },
  methods: {
    actionSuccessCb (response) {
      this.$refs[this.tableId].refresh()
    },
    retryCb (useToken) {
      this.useToken = useToken
      this.$refs[this.tableId].refresh()
    },
    errorCb (error) {
      this.error = error
      this.callLogin()
    },
    callLogin () {
      this.checkAuth(this.error, this.retryCb, this.errorCb)
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
