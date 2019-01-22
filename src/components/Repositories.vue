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
      checkSyncTalService: config.api.services.get.talSync,
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
      syncMessage: null,
      syncChecks: {}
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
        buttonRef.disabled = false
        buttonRef.innerText = me.$root.$i18n.t('repositories.sync')
      }).finally(function () {
        // Nothing
      })
    },
    syncSuccessCb (response) {
      if (response.data.execStatus === 'requested') {
        this.syncMessage = 'common.syncSuccess'
        this.createCheckInterval(this.syncItemId)
      } else if (response.data.execStatus === 'running') {
        this.syncMessage = 'common.syncRunning'
        this.createCheckInterval(this.syncItemId)
      } else {
        this.syncMessage = 'common.syncError'
        this.destroyCheckInterval(this.syncItemId)
        let buttonRef = this.$refs[this.tableId].$refs[this.syncAction.buttonRef + this.syncItemId]
        buttonRef.disabled = false
        buttonRef.innerText = this.$root.$i18n.t('repositories.sync')
      }
      this.syncError = null
      this.syncItemId = null
      this.$refs.syncSuccessModal.show()
    },
    syncErrorCb (error) {
      this.syncError = error
      this.syncLogin()
    },
    syncLogin () {
      this.checkAuth(this.syncError, this.trySync, this.syncErrorCb)
    },
    checkSyncStatus (useToken, itemId) {
      let me = this
      me.syncError = null
      me.useToken = useToken
      let service = me.checkSyncTalService.replace(':id', itemId)
      let promise = axios.getPromise(
        axios.methods.get,
        me.$root.$i18n.locale,
        service,
        useToken)
      promise.then(function (response) {
        switch (response.data.execStatus) {
          case 'finished-ok':
          case 'finished-error':
          case 'not-running':
            me.resetSyncAction(itemId)
            break
          default:
            // Running
            let buttonRef = me.$refs[me.tableId].$refs[me.syncAction.buttonRef + itemId]
            buttonRef.disabled = true
            buttonRef.innerText = me.$root.$i18n.t('repositories.syncing')
            me.createCheckInterval(itemId)
            break
        }
      }).catch(function (error) {
        me.checkSyncErrorCb(error, itemId)
      }).finally(function () {
        // Nothing
      })
    },
    checkSyncErrorCb (error, itemId) {
      this.syncError = error
      this.checkSyncLogin()
    },
    checkSyncLogin (itemId) {
      this.checkAuth(this.syncError, this.checkSyncStatus, this.checkSyncErrorCb, itemId)
    },
    createCheckInterval (itemId) {
      if (!this.syncChecks[itemId]) {
        this.syncChecks[itemId] = setInterval(this.checkSyncStatus, 2000, this.useToken, itemId)
      }
    },
    destroyCheckInterval (itemId) {
      if (this.syncChecks[itemId]) {
        clearInterval(this.syncChecks[itemId])
        this.syncChecks[itemId] = null
      }
    },
    resetSyncAction (itemId) {
      let buttonRef = this.$refs[this.tableId].$refs[this.syncAction.buttonRef + itemId]
      buttonRef.disabled = false
      buttonRef.innerText = this.$root.$i18n.t('repositories.sync')
      this.destroyCheckInterval(itemId)
    }
  }
}
</script>

<style>
</style>
