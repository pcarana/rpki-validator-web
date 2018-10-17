<template>
  <span>
    <b-modal
      :id="id"
      :ref="id"
      :title="$t('common.confirm')"
      :ok-title="$t('common.delete')"
      :cancel-title="$t('common.cancel')"
      @shown="deleteError = null"
      @ok="sendRequest">
      <b-container fluid>
        <b-row>
          <b-col>
            <loading :show="loading"></loading>
          </b-col>
        </b-row>
        <b-row class="mb-1" v-if="deleteErrorMessage">
          <b-col>
            <b-alert show variant="danger">
              <span v-html="deleteErrorMessage"></span>
            </b-alert>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col>
            {{ $t('common.confirmDelete') }}<br />
            <b-card>
              <json-object :object="item"></json-object>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal
      id="successModal"
      ref="successModal"
      ok-only>
      <h2>{{ $t('common.deleteSuccess') }}</h2>
    </b-modal>
  </span>
</template>

<script>
import Loading from '@/components/common/Loading.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  props: {
    id: String,
    successCallback: Function,
    type: {
      type: String,
      validator: function (value) {
        return ['prefix', 'bgpsec'].indexOf(value) !== -1
      }
    },
    item: Object
  },
  data () {
    return {
      deleteError: null,
      loading: false,
      auth: {}
    }
  },
  components: {
    'loading': Loading
  },
  methods: {
    sendRequest (event) {
      event.preventDefault()
      this.deleteError = null
      this.loading = true
      let promise = this.promiseCb(null)
      axios.processPromise(promise,
        this.deleteSuccessCb,
        this.deleteErrorCb,
        this.finallyCb)
    },
    promiseCb (auth) {
      this.auth = auth
      let service = this.deleteService.replace(':id', this.item.id)
      return axios.getPromise(
        axios.methods.delete,
        this.$root.$i18n.locale,
        service,
        auth)
    },
    deleteSuccessCb (response) {
      this.$refs[this.id].hide()
      this.successCallback(response)
      this.$refs.successModal.show()
    },
    deleteErrorCb (error) {
      this.deleteError = error
      this.callLogin()
    },
    finallyCb () {
      this.loading = false
    },
    callLogin () {
      this.checkAuth(this.deleteError, this.promiseCb, this.deleteSuccessCb, this.deleteErrorCb)
    }
  },
  computed: {
    deleteErrorMessage: function () {
      let error = this.deleteError
      if (!error) {
        return null
      }
      // Get code
      if (error.response && error.response.status === 400 && error.response.data.message) {
        let deleteErrorMessage = error.response.data.message
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          let list = '<ul>'
          for (let currErr of error.response.data.errors) {
            list += '<li><b>' + this.i18n.t(this.apiPropsMap.SlurmPrefix[currErr.title.split('.')[1]])
            list += ':</b> ' + currErr.description + '</li>'
          }
          list += '</ul>'
          deleteErrorMessage += list
        }
        return deleteErrorMessage
      } else if (error.validationMessage) {
        return this.i18n.t(error.validationMessage)
      }
      return null
    },
    deleteService: function () {
      if (this.type === 'prefix') {
        return config.api.services.delete.slurmPrefix
      }
      return config.api.services.delete.slurmBgpsec
    }
  }
}
</script>

<style>
</style>
