<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col>
        <h1>{{ $t('roa.title') }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <loading :show="loading"></loading>
        <error-display :error="error" :callLogin="callLogin"></error-display>
      </b-col>
    </b-row>
    <b-row v-if="roa">
      <b-col>
        <b-card :title="$t('roa.general.title')">
          <b-container>
            <b-row>
              <b-col><b>{{ $t('common.asn') }}</b></b-col>
              <b-col>{{ roa.asn }}</b-col>
            </b-row>
            <b-row>
              <b-col><b>{{ $t('common.prefix') }}</b></b-col>
              <b-col>{{ roa.prefix }}</b-col>
            </b-row>
            <b-row>
              <b-col><b>{{ $t('common.prefixMaxLength') }}</b></b-col>
              <b-col>{{ roa.prefixMaxLength }}</b-col>
            </b-row>
            <b-row>
              <b-col><b>{{ $t('common.prefixFamily') }}</b></b-col>
              <b-col>{{ roa.prefixFamily }}</b-col>
            </b-row>
            <b-row>
              <b-col><b>{{ $t('roa.general.cms') }}</b></b-col>
              <b-col>
                <json-object :object="roa.cms"></json-object>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
        <b-card :title="$t('roa.eecert.title')">
          <json-object :object="roa.cms.content.certificates[0]"></json-object>
        </b-card>
        <b-card v-if="roa.gbrs && roa.gbrs.length > 0" :title="$t('roa.gbr.title')">
          <json-array :array="roa.gbrs"></json-array>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button @click="back">{{ $t('general.return') }}</b-button>
      </b-col>
    </b-row>
  </b-container>
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
      loading: false
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
    loadData () {
      this.error = null
      this.loading = true
      let promise = this.promiseCb(null)
      axios.processPromise(promise,
        this.successCb,
        this.errorCb,
        this.finallyCb)
    },
    promiseCb (auth) {
      let service = config.api.services.get.roaDetail.replace(
        ':id',
        this.$route.params.roaId
      )
      return axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        service,
        auth)
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
      this.checkAuth(this.error, this.promiseCb, this.successCb, this.errorCb)
    }
  },
  created: function () {
    this.loadData()
  }
}
</script>

<style>
</style>
