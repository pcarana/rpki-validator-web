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
        <custom-table :items="loadTals"
                      :tableFields="tableFields"
                      :filterFunction="filterFunction"
                      :searchFilterOpts="searchFilterOpts"
                      :showDetailButton="true"
                      :error="error || syncError"
                      :loading="loading"
                      :tableId="tableId"
                      :ref="tableId"
                      :callLogin="callLogin"
                      :showAdditionalAction="true"
                      :additionalAction="syncAction">
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
          sortable: true,
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
        { text: 'repository.general.name', value: 'name' },
        { text: 'repository.general.uris', value: 'uris' }
      ],
      error: null,
      loading: false,
      auth: {},
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
    loadTals (ctx) {
      let me = this
      let myAxios = axios.createAxios(me.$root.$i18n.locale, me.auth)
      me.loading = true
      me.error = null
      return myAxios.get(me.getListService).then(function (response) {
        let data = response.data
        if (data.found === data.returned) {
          return data.results
        }
        return me.getNextPage(myAxios, data, data.results, me.getListService)
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
        case 'name':
          return item.name.match(regexp)
        case 'uris':
          // Map the values from the obj to search on those values only
          return item.uris.map(function (uri) {
            return uri.location
          }).toString().match(regexp)
        default:
          return item.name.match(regexp) || item.uris.map(function (uri) {
            return uri.location
          }).toString().match(regexp)
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
    successCb (response) {
      this.error = null
      this.$refs[this.tableId].refresh()
    },
    errorCb (error) {
      this.error = error
      this.callLogin()
    },
    callLogin () {
      if (this.error) {
        this.checkAuth(this.error, this.promiseCb, this.successCb, this.errorCb)
      } else {
        this.syncLogin()
      }
    },
    syncTal (tal) {
      let me = this
      me.syncError = null
      me.syncItemId = tal.id
      let buttonRef = me.$refs[me.tableId].$refs[me.syncAction.buttonRef + me.syncItemId]
      buttonRef.disabled = true
      buttonRef.innerText = me.i18n.t('repositories.syncing')
      let promise = this.syncCb(null)
      promise.then(function (response) {
        me.syncSuccessCb(response)
      }).catch(function (error) {
        me.syncErrorCb(error)
      }).finally(function () {
        buttonRef.disabled = false
        buttonRef.innerText = me.i18n.t('repositories.sync')
      })
    },
    syncCb (auth) {
      this.auth = auth
      let service = this.syncTalService.replace(':id', this.syncItemId)
      return axios.getPromise(
        axios.methods.post,
        this.$root.$i18n.locale,
        service,
        this.auth)
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
      this.checkAuth(this.syncError, this.syncCb, this.syncSuccessCb, this.syncErrorCb)
    }
  }
}
</script>

<style>
</style>
