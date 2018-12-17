<template>
  <div>
    <b-container fluid>
      <b-row class="my-3">
        <b-col>
          <h1>{{ $t('roa.title') }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <loading :show="loading"></loading>
          <error-display :error="error" :callLogin="callLogin" :callRetry="loadData"></error-display>
        </b-col>
      </b-row>
    </b-container>
    <b-card-group deck class="mx-0" v-if="roa">
      <b-card :header="$t('roa.general.title')">
        <b-container>
          <b-row>
            <b-col>
              <b>{{ $t('common.asn') }}</b>
              <p class="pl-2 mb-1">{{ roa.asn }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b>{{ $t('common.prefix') }}</b>
              <p class="pl-2 mb-1">{{ roa.prefix }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b>{{ $t('common.prefixMaxLength') }}</b>
              <p class="pl-2 mb-1">{{ roa.prefixMaxLength }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b>{{ $t('common.prefixFamily') }}</b>
              <p class="pl-2 mb-1">{{ roa.prefixFamily }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b>{{ $t('roa.general.cms') }}</b>
              <json-object :object="roa.cms"></json-object>
            </b-col>
          </b-row>
        </b-container>
      </b-card>
      <b-card :header="$t('roa.eecert.title')">
        <json-object :object="roa.cms.content.certificates[0]"></json-object>
      </b-card>
    </b-card-group>
    <b-card-group deck class="mx-0 my-2" v-if="roa && roa.gbrs && roa.gbrs.length > 0">
      <b-card :header="$t('roa.gbr.title')">
        <json-array :array="roa.gbrs"></json-array>
      </b-card>
    </b-card-group>
    <b-button class="ml-2 mt-2" @click="back">{{ $t('general.return') }}</b-button>
  </div>
</template>

<script>
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import Loading from '@/components/common/Loading.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      roa: null,
      error: null,
      loading: false,
      useToken: false
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  methods: {
    back () {
      this.$router.back()
    },
    loadData (useToken) {
      this.error = null
      this.loading = true
      this.useToken = useToken
      let service = config.api.services.get.roaDetail.replace(
        ':id',
        this.$route.params.roaId
      )
      let promise = axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        service,
        useToken)
      axios.processPromise(promise,
        this.successCb,
        this.errorCb,
        this.finallyCb)
    },
    successCb (response) {
      this.error = null
      this.roa = response.data
    },
    errorCb (error) {
      this.error = error
      this.roa = null
      this.callLogin()
    },
    finallyCb () {
      this.loading = false
    },
    callLogin () {
      this.checkAuth(this.error, this.loadData, this.errorCb)
    }
  },
  created: function () {
    this.loadData(this.useToken)
  }
}
</script>

<style>
</style>
