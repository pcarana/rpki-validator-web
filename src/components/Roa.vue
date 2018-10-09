<template>
  <b-container class="mt-2 mx-4">
    <h1>{{ $t('roa.title') }}</h1>
    <p v-if="error">{{ error }}</p>
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
    <b-button @click="back">{{ $t('general.return') }}</b-button>
  </b-container>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      eventHub: null,
      roa: null,
      error: null
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    successCb (response) {
      this.roa = response.data
    },
    errorCb (error) {
      this.error = error
    }
  },
  created: function () {
    const service = config.api.services.get.roaDetail.replace(
      ':id',
      this.$route.params.roaId
    )
    axios.get(
      this.$root.$i18n.locale,
      service,
      this.successCb,
      this.errorCb,
      this.eventHub
    )
  }
}
</script>

<style>
</style>
