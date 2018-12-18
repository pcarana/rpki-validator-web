<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col>
        <h1>{{ $t('repositories.title') }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>{{ $t('repositories.description') }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <custom-table :tableFields="tableFields"
                      :searchFilterOpts="searchFilterOpts"
                      :showDetailButton="true"
                      :tableId="tableId"
                      :ref="tableId"
                      :callLogin="callLogin"
                      :listService="getListService"
                      :context="this"
                      :errorCb="errorCb"
                      :showAdditionalAction="true"
                      :additionalAction="syncAction"
                      :additionalError="syncError">
        </custom-table>
        <b-modal
          id="syncSuccessModal"
          ref="syncSuccessModal"
          size="sm"
          ok-only>
          <p class="text-center">{{ $t(syncMessage) }}</p>
        </b-modal>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CustomTable from '@/components/common/CustomTable.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  components: {
    'custom-table': CustomTable
  },
  data () {
    return {
      tableId: 'repositoriesTable',
      getListService: config.api.services.get.talList,
      syncTalService: config.api.services.post.talSync,
      tableFields: [
        {key: 'name', label: 'repository.general.name', sortable: true},
        {
          key: 'uris',
          label: 'repository.general.uris',
          sortable: false,
          formatter: (value) => {
            let formatted = ''
            for (let i = 0; i < value.length; i++) {
              formatted += value[i].location
              formatted += (i < value.length - 1 ? ',' : '')
            }
            return formatted
          }
        },
        {key: 'action', label: 'common.action', sortable: false}
      ],
      searchFilterOpts: [
        { text: 'repository.general.name', value: 'name' }
      ],
      useToken: false,
      error: null,
      syncAction: {
        onClick: this.syncTal,
        label: 'repositories.sync',
        buttonRef: 'repoSync'
      },
      syncItemId: null,
      syncError: null,
      syncMessage: null
    }
  },
  methods: {
    retryCb (useToken) {
      this.useToken = useToken
      this.$refs[this.tableId].refresh()
    },
    errorCb (error) {
      this.error = error
      this.callLogin()
    },
    callLogin () {
      if (this.error) {
        this.checkAuth(this.error, this.retryCb, this.errorCb)
      } else {
        this.syncLogin()
      }
    },
    syncTal (tal) {
      this.syncItemId = tal.id
      this.trySync(this.useToken)
    },
    trySync (useToken) {
      let me = this
      me.syncError = null
      me.useToken = useToken
      let buttonRef = me.$refs[me.tableId].$refs[me.syncAction.buttonRef + me.syncItemId]
      buttonRef.disabled = true
      buttonRef.innerText = me.$root.$i18n.t('repositories.syncing')
      let service = me.syncTalService.replace(':id', me.syncItemId)
      let promise = axios.getPromise(
        axios.methods.post,
        me.$root.$i18n.locale,
        service,
        useToken)
      promise.then(function (response) {
        me.syncSuccessCb(response)
      }).catch(function (error) {
        me.syncErrorCb(error)
      }).finally(function () {
        buttonRef.disabled = false
        buttonRef.innerText = me.$root.$i18n.t('repositories.sync')
      })
    },
    syncSuccessCb (response) {
      this.syncError = null
      this.syncItemId = null
      this.syncMessage = response.data.execStatus === 0 ? 'common.syncSuccess' : 'common.syncError'
      this.$refs.syncSuccessModal.show()
    },
    syncErrorCb (error) {
      this.syncError = error
      this.syncLogin()
    },
    syncLogin () {
      this.checkAuth(this.syncError, this.trySync, this.syncErrorCb)
    }
  }
}
</script>

<style>
</style>
