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
    <b-row class="mt-2">
      <b-col>
        <loading :show="loading"></loading>
        <error-display :error="error" :callLogin="callLogin"></error-display>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-container v-if="validationResult" class="mx-0 px-0">
          <b-row>
            <b-col cols="4">
              <b-card :header="$t('validate.status')"
                :title="$t('validate.state.' + validationResult.validityState)"
                :bg-variant="statusVariant"
                text-variant="white"
                class="text-center">
              </b-card>
            </b-col>
            <b-col cols="8">
              <b-card :header="$t('validate.validityState')">
                <b-container>
                  <b-row class="my-auto align-middle text-center">
                    <b-col cols="3"></b-col>
                    <b-col cols="9">
                      <b-row>
                        <b-col cols="4"></b-col>
                        <b-col cols="8">
                          <h4>{{ $t('common.asn') }}</h4>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col></b-col>
                        <b-col :class="{
                          'border': true,
                          'border-black': true,
                          'bg-light': true,
                          'font-weight-bold': validationResult.asState === 'matching',
                          'shadow': validationResult.asState === 'matching'
                          }">
                          {{ $t('validate.validityMatrix.matchAs') }}
                        </b-col>
                        <b-col :class="{
                          'border': true,
                          'border-black': true,
                          'bg-light': true,
                          'font-weight-bold': validationResult.asState === 'non-matching',
                          'shadow': validationResult.asState === 'non-matching'
                          }">
                          {{ $t('validate.validityMatrix.nonMatchAs') }}
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="3" class="my-auto align-middle text-right">
                      <h4>{{ $t('common.prefix') }}</h4>
                    </b-col>
                    <b-col class="my-auto align-middle">
                      <b-row>
                        <b-col :class="{
                          'border': true,
                          'border-black': true,
                          'bg-light': true,
                          'font-weight-bold': generalPrefixState('non-intersecting'),
                          'shadow': generalPrefixState('non-intersecting')
                          }">
                          {{ $t('validate.validityMatrix.nonIntersecting') }}
                        </b-col>
                        <b-col class="text-center border border-black">
                          <img v-if="asnMatchPrefixState('non-intersecting')" src="@/assets/gray_check.svg" alt="X" />
                        </b-col>
                        <b-col class="text-center border border-black">
                          <img v-if="asnNoMatchPrefixState('non-intersecting')" src="@/assets/gray_check.svg" alt="X" />
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col :class="{
                          'border': true,
                          'border-black': true,
                          'bg-light': true,
                          'font-weight-bold': generalPrefixState('covering-aggregate'),
                          'shadow': generalPrefixState('covering-aggregate')
                          }">
                          {{ $t('validate.validityMatrix.coveringAggregate') }}
                        </b-col>
                        <b-col class="text-center border border-black">
                          <img v-if="asnMatchPrefixState('covering-aggregate')" src="@/assets/gray_check.svg" alt="X" />
                        </b-col>
                        <b-col class="text-center border border-black">
                          <img v-if="asnNoMatchPrefixState('covering-aggregate')" src="@/assets/gray_check.svg" alt="X" />
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col :class="{
                          'border': true,
                          'border-black': true,
                          'bg-light': true,
                          'font-weight-bold': generalPrefixState('match-roa-prefix'),
                          'shadow': generalPrefixState('match-roa-prefix')
                          }">
                          {{ $t('validate.validityMatrix.matchRoa') }}
                        </b-col>
                        <b-col class="text-center border border-black">
                          <img v-if="asnMatchPrefixState('match-roa-prefix')" src="@/assets/green_check.svg" alt="X" />
                        </b-col>
                        <b-col class="text-center border border-black">
                          <img v-if="asnNoMatchPrefixState('match-roa-prefix')" src="@/assets/red_check.svg" alt="X" />
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col :class="{
                          'border': true,
                          'border-black': true,
                          'bg-light': true,
                          'font-weight-bold': generalPrefixState('more-specific-than-roa'),
                          'shadow': generalPrefixState('more-specific-than-roa')
                          }">
                          {{ $t('validate.validityMatrix.moreSpecific') }}
                        </b-col>
                        <b-col class="text-center border border-black">
                          <img v-if="asnMatchPrefixState('more-specific-than-roa')" src="@/assets/red_check.svg" alt="X" />
                        </b-col>
                        <b-col class="text-center border border-black">
                          <img v-if="asnNoMatchPrefixState('more-specific-than-roa')" src="@/assets/red_check.svg" alt="X" />
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-container>
              </b-card>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col cols="12">
              <b-card v-if="validationResult && validationResult.match" :header="$t(matchTitle)">
                <json-object :object="validationResult.match"></json-object>
              </b-card>
            </b-col>
          </b-row>
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
      this.validationResult = null
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
    },
    generalPrefixState (prefixState) {
      return this.asnMatchPrefixState(prefixState) || this.asnNoMatchPrefixState(prefixState)
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
