<template>
    <b-container class="mt-2 mx-4">
      <h1>{{ $t('validate.title') }}</h1>
      <p>{{ $t('validate.description') }}</p>
      <b-form @submit="onSubmit">
        <b-form-group horizontal :label="$t('validate.asn')" label-for="asn">
          <b-form-input id="asn" type="number" v-model.trim="asn" />
        </b-form-group>
        <b-form-group horizontal :label="$t('validate.prefix')" label-for="prefix">
          <b-form-input id="prefix" type="text" v-model.trim="prefix" />
        </b-form-group>
        <b-form-group horizontal :label="$t('validate.prefixLength')" label-for="prefixLength">
          <b-form-input id="prefixLength" type="number" v-model.trim="prefixLength" />
        </b-form-group>
        <b-button type="submit" variant="primary">{{ $t('validate.request') }}</b-button>
      </b-form>
      <br />
      <p v-if="error">{{ error }}</p>
      <b-container v-if="validationResult">
        <b>{{ $t('validate.validityState') }}</b>
        <b-alert show :variant="statusVariant">
          {{ $t('validate.state.' + validationResult.validityState) }}
        </b-alert>
        <b-container>
          <b-row>
            <b-col></b-col>
            <b-col>
              <b-row>
                <b-col></b-col>
                <b-col>{{ $t('validate.asn') }}</b-col>
              </b-row>
              <b-row>
                <b-col></b-col>
                <b-col>{{ $t('validate.validityMatrix.matchAs') }}</b-col>
                <b-col>{{ $t('validate.validityMatrix.nonMatchAs') }}</b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col>{{ $t('validate.prefix') }}</b-col>
            <b-col>
              <b-row>
                <b-col>{{ $t('validate.validityMatrix.nonIntersecting') }}</b-col>
                <b-col><img v-if="asnMatchPrefixState('non-intersecting')" src="@/assets/gray_check.svg" alt="X" /></b-col>
                <b-col><img v-if="asnNoMatchPrefixState('non-intersecting')" src="@/assets/gray_check.svg" alt="X" /></b-col>
              </b-row>
              <b-row>
                <b-col>{{ $t('validate.validityMatrix.coveringAggregate') }}</b-col>
                <b-col><img v-if="asnMatchPrefixState('covering-aggregate')" src="@/assets/gray_check.svg" alt="X" /></b-col>
                <b-col><img v-if="asnNoMatchPrefixState('covering-aggregate')" src="@/assets/gray_check.svg" alt="X" /></b-col>
              </b-row>
              <b-row>
                <b-col>{{ $t('validate.validityMatrix.matchRoa') }}</b-col>
                <b-col><img v-if="asnMatchPrefixState('match-roa-prefix')" src="@/assets/green_check.svg" alt="X" /></b-col>
                <b-col><img v-if="asnNoMatchPrefixState('match-roa-prefix')" src="@/assets/red_check.svg" alt="X" /></b-col>
              </b-row>
              <b-row>
                <b-col>{{ $t('validate.validityMatrix.moreSpecific') }}</b-col>
                <b-col><img v-if="asnMatchPrefixState('more-specific-than-roa')" src="@/assets/red_check.svg" alt="X" /></b-col>
                <b-col><img v-if="asnNoMatchPrefixState('more-specific-than-roa')" src="@/assets/red_check.svg" alt="X" /></b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="validationResult && validationResult.match">
          <h3>{{ $t(matchTitle) }}</h3>
          <div v-html='matchRoaFormatted'></div>
        </b-container>
      </b-container>
    </b-container>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      asn: null,
      prefix: null,
      prefixLength: null,
      validationResult: null,
      eventHub: null,
      error: null
    }
  },
  methods: {
    successCb (response) {
      this.error = null
      this.validationResult = response.data
    },
    errorCb (error) {
      this.error = error
      this.validationResult = null
    },
    onSubmit (evt) {
      evt.preventDefault()
      let service = config.api.services.get.validate
      service = service.replace(':asn', this.asn)
      service = service.replace(':prefix-length', this.prefixLength)
      service = service.replace(':prefix', this.prefix)
      axios.get(
        this.$root.$i18n.locale,
        service,
        this.successCb,
        this.errorCb,
        this.eventHub
      )
    },
    asnMatchPrefixState (prefixState) {
      return this.validationResult.asState === 'matching' &&
              this.validationResult.prefixState === prefixState
    },
    asnNoMatchPrefixState (prefixState) {
      return this.validationResult.asState === 'non-matching' &&
              this.validationResult.prefixState === prefixState
    }
  },
  computed: {
    statusVariant: function () {
      if (this.validationResult) {
        switch (this.validationResult.validityState) {
          case 'valid':
            return 'success'
          case 'invalid':
            return 'danger'
          default:
            return 'secondary'
        }
      }
    },
    matchTitle: function () {
      if (this.validationResult) {
        return this.validationResult.validityState === 'valid' ? 'validate.roaMatch' : 'validate.roaClosestMatch'
      }
      return ''
    },
    matchRoaFormatted: function () {
      return this.formatObject(this.validationResult.match)
    }
  }
}
</script>

<style>
</style>
