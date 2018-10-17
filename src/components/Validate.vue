<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col>
        <h1>{{ $t('validate.title') }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>{{ $t('validate.description') }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form @submit="onSubmit">
          <b-form-group horizontal :label="$t('common.asn')" label-for="asn">
            <b-form-input id="asn"
              ref="asn"
              type="number"
              v-model.trim="asn"
              required
              :min="validationRules.asn.min"
              :max="validationRules.asn.max"
              :state="asnState">
            </b-form-input>
            <b-form-invalid-feedback>
              {{ $t('errors.asnInvalid') }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group horizontal :label="$t('common.prefix')" label-for="prefix">
            <b-form-input id="prefix"
              ref="prefix"
              type="text"
              v-model.trim="prefix"
              required
              :state="prefixState">
            </b-form-input>
            <b-form-invalid-feedback>
              {{ $t('errors.prefixInvalid') }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group horizontal :label="$t('common.prefixLength')" label-for="prefixLength">
            <b-form-input id="prefixLength"
              ref="prefixLength"
              type="number"
              v-model.trim="prefixLength"
              required
              :min="prefixLengthMin"
              :max="prefixLengthMax"
              :state="prefixLengthState">
            </b-form-input>
            <b-form-invalid-feedback>
              {{ $t('errors.prefixLengthInvalid', { min: prefixLengthMin, max: prefixLengthMax }) }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-button type="submit" variant="primary">{{ $t('validate.request') }}</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <loading :show="loading"></loading>
        <error-display :error="error" :callLogin="callLogin"></error-display>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
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
                  <b-col>{{ $t('common.asn') }}</b-col>
                </b-row>
                <b-row>
                  <b-col></b-col>
                  <b-col>{{ $t('validate.validityMatrix.matchAs') }}</b-col>
                  <b-col>{{ $t('validate.validityMatrix.nonMatchAs') }}</b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row>
              <b-col>{{ $t('common.prefix') }}</b-col>
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
            <json-object :object="validationResult.match"></json-object>
          </b-container>
        </b-container>
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
      asn: null,
      prefix: null,
      prefixLength: null,
      validationResult: null,
      error: null,
      loading: false
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.error = null
      this.loading = true
      let promise = this.promiseCb(null)
      axios.processPromise(promise,
        this.successCb,
        this.errorCb,
        this.finallyCb)
    },
    promiseCb (auth) {
      let service = config.api.services.get.validate
      service = service.replace(':asn', this.asn)
      service = service.replace(':prefix-length', this.prefixLength)
      service = service.replace(':prefix', this.prefix)
      return axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        service,
        auth)
    },
    successCb (response) {
      this.error = null
      this.validationResult = response.data
    },
    errorCb (error) {
      this.error = error
      this.validationResult = null
      this.callLogin()
    },
    finallyCb () {
      this.loading = false
    },
    callLogin () {
      this.checkAuth(this.error, this.promiseCb, this.successCb, this.errorCb)
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
    asnState: function () {
      if (this.asn) {
        return this.asn >= this.validationRules.asn.min &&
               this.asn <= this.validationRules.asn.max
      }
      return null
    },
    prefixState: function () {
      if (this.prefix && this.prefix.length > 0) {
        return this.validationRules.prefix.ipv4Regex.test(this.prefix) ||
               this.validationRules.prefix.ipv6Regex.test(this.prefix)
      }
      return null
    },
    prefixLengthState: function () {
      if (this.prefixLength) {
        return this.prefixLength >= this.prefixLengthMin &&
               this.prefixLength <= this.prefixLengthMax
      }
      return this.prefix && this.prefix.length > 0 ? false : null
    },
    prefixLengthMin: function () {
      // Use a common value, if any of the 'min' changes then add here the rules
      return this.validationRules.prefixLength.v4.min
    },
    prefixLengthMax: function () {
      if (this.prefix && this.prefix.length > 0) {
        if (this.validationRules.prefix.ipv4Regex.test(this.prefix)) {
          return this.validationRules.prefixLength.v4.max
        }
      }
      return this.validationRules.prefixLength.v6.max
    },
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
    }
  }
}
</script>

<style>
</style>
