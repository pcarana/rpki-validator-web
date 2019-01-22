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
      this.trySync(this.useToken, tal.id)
    },
    trySync (useToken, syncItemId) {
      let me = this
      me.syncError = null
      me.useToken = useToken
      let buttonRef = me.$refs[me.tableId].$refs[me.syncAction.buttonRef + syncItemId]
      buttonRef.disabled = true
      buttonRef.innerText = me.$root.$i18n.t('repositories.syncing')
      let service = me.syncTalService.replace(':id', syncItemId)
      let promise = axios.getPromise(
        axios.methods.post,
        me.$root.$i18n.locale,
        service,
        useToken)
      promise.then(function (response) {
        me.syncSuccessCb(response, syncItemId)
      }).catch(function (error) {
        me.syncErrorCb(error, syncItemId)
        buttonRef.disabled = false
        buttonRef.innerText = me.$root.$i18n.t('repositories.sync')
      }).finally(function () {
        // Nothing
      })
    },
    syncSuccessCb (response, syncItemId) {
      if (response.data.execStatus === 'requested') {
        this.syncMessage = 'common.syncSuccess'
        this.createCheckInterval(syncItemId)
      } else if (response.data.execStatus === 'running') {
        this.syncMessage = 'common.syncRunning'
        this.createCheckInterval(syncItemId)
      } else {
        this.syncMessage = 'common.syncError'
        this.destroyCheckInterval(syncItemId)
        let buttonRef = this.$refs[this.tableId].$refs[this.syncAction.buttonRef + syncItemId]
        buttonRef.style.backgroundColor = 'red'
        buttonRef.innerText = this.$root.$i18n.t('repositories.syncError')
        setTimeout(function () {
          buttonRef.disabled = false
          buttonRef.innerText = this.$root.$i18n.t('repositories.sync')
          buttonRef.style.backgroundColor = ''
        }, 8000)
      }
      this.syncError = null
    },
    syncErrorCb (error, itemId) {
      this.syncError = error
      this.syncLogin(itemId)
    },
    syncLogin (itemId) {
      this.checkAuth(this.syncError, this.trySync, this.syncErrorCb, itemId)
    },
    checkSyncStatus (useToken, itemId) {
      let me = this
      me.syncError = null
      me.useToken = useToken
      // Create the interval (just in case this method is reached from an error flow)
      me.createCheckInterval(itemId)
      let service = me.checkSyncTalService.replace(':id', itemId)
      let promise = axios.getPromise(
        axios.methods.get,
        me.$root.$i18n.locale,
        service,
        useToken)
      promise.then(function (response) {
        let buttonRef = me.$refs[me.tableId].$refs[me.syncAction.buttonRef + itemId]
        switch (response.data.execStatus) {
          case 'finished-ok':
            me.destroyCheckInterval(itemId)
            buttonRef.style.backgroundColor = 'green'
            buttonRef.innerText = me.$root.$i18n.t('repositories.syncSuccess')
            setTimeout(me.resetSyncAction, 5000, itemId)
            break
          case 'finished-error':
            me.destroyCheckInterval(itemId)
            buttonRef.style.backgroundColor = 'red'
            buttonRef.innerText = me.$root.$i18n.t('repositories.syncError')
            setTimeout(me.resetSyncAction, 5000, itemId)
            break
          case 'not-running':
            me.destroyCheckInterval(itemId)
            me.resetSyncAction(itemId)
            break
          default:
            // Running
            buttonRef.disabled = true
            buttonRef.innerText = me.$root.$i18n.t('repositories.syncing')
            me.createCheckInterval(itemId)
            break
        }
      }).catch(function (error) {
        me.destroyCheckInterval(itemId)
        me.checkSyncErrorCb(error, itemId)
      }).finally(function () {
        // Nothing
      })
    },
    checkSyncErrorCb (error, itemId) {
      this.syncError = error
      // Prevent the check during the error display
      this.destroyCheckInterval(itemId)
      this.checkSyncLogin(itemId)
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
      buttonRef.style.backgroundColor = ''
    }
  }
}
</script>

<style>
</style>
