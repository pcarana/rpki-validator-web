<template>
  <span>
    <b-button v-b-modal="modalId">
      {{ $t(addButtonLabel) }}
    </b-button>
    <b-modal
      :id="modalId"
      :ref="modalId"
      @shown="focusFirstField"
      :title="$t(addButtonLabel)"
      :ok-title="$t('common.add')"
      :cancel-title="$t('common.cancel')"
      @ok="sendRequest"
      no-close-on-backdrop>
      <b-container fluid>
        <b-row>
          <b-col>
            <loading :show="loading"></loading>
            <error-display :error="createError" :apiObject="apiPropsMap.SlurmBgpsec"></error-display>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2"><label for="asn">{{ $t('common.asn') }}</label></b-col>
          <b-col>
            <b-form-group id="asnGroup">
              <b-form-input id="asn"
                ref="asn"
                type="number"
                v-model="newObject.asn"
                :min="validationRules.asn.min"
                :max="validationRules.asn.max"
                :state="asnState">
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t('errors.asnInvalid') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2"><label for="ski">{{ $t('common.ski') }}</label></b-col>
          <b-col>
            <b-form-group id="skiGroup"
              :description="$t('common.hexValue')">
              <b-form-input id="ski"
                ref="ski"
                type="text"
                v-model.trim="newObject.ski"
                :state="skiState">
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t('errors.skiInvalid') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-1" v-if="showRouterPublicKey">
          <b-col cols="2">
            <label for="routerPublicKey">{{ $t('common.routerPublicKey') }}</label>
          </b-col>
          <b-col>
            <b-form-group id="routerPublicKeyGroup"
              :description="$t('common.derFormat')">
              <b-form-textarea id="routerPublicKey"
                ref="routerPublicKey"
                v-model.trim="newObject.routerPublicKey"
                :state="routerPublicKeyState"
                :rows="3">
              </b-form-textarea>
              <b-form-invalid-feedback>
                {{ $t('errors.routerPublicKeyInvalid') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2"><label for="comment">{{ $t('common.comment') }}</label></b-col>
          <b-col>
            <b-form-group id="commentGroup">
              <b-form-input id="comment"
                ref="comment"
                type="text"
                v-model.trim="newObject.comment"
                :maxlength="validationRules.comment.max"
                :state="commentState">
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t('errors.commentInvalid',
                      {
                        min: validationRules.comment.min,
                        max: validationRules.comment.max
                      })
                }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal
      :id="successModalId"
      :ref="successModalId"
      ok-only>
      <h2>{{ $t('common.createSuccess') }}</h2>
    </b-modal>
  </span>
</template>

<script>
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import Loading from '@/components/common/Loading.vue'
import axios from '@/axios'
import apiPropsMixin from '@/mixins/apiPropsMixin.js'
import validationsMixin from '@/mixins/validationsMixin.js'

export default {
  props: {
    successCallback: Function,
    bgpsecType: String,
    addButtonLabel: String,
    postService: String
  },
  data () {
    return {
      newObject: {
        asn: null,
        ski: null,
        routerPublicKey: null,
        comment: null
      },
      createError: null,
      loading: false,
      useToken: false,
      newBgpsec: {}
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  methods: {
    focusFirstField () {
      this.$refs.asn.focus()
    },
    sendRequest (event) {
      event.preventDefault()
      let newObject = this.newObject
      if (!this.validObject) {
        let validationMessage = 'errors.checkErrors'
        if (!this.showRouterPublicKey && !this.newObject.asn && !this.newObject.ski) {
          validationMessage = 'errors.asnOrSkiRequired'
        }
        this.createError = { validationMessage: validationMessage }
        return
      }
      this.newBgpsec = {}
      if (newObject.asn) {
        this.newBgpsec.asn = parseInt(newObject.asn)
      }
      if (newObject.ski) {
        this.newBgpsec.SKI = btoa(newObject.ski).replace(/=/g, '')
      }
      if (this.showRouterPublicKey && newObject.routerPublicKey) {
        this.newBgpsec.routerPublicKey = newObject.routerPublicKey
      }
      if (newObject.comment) {
        this.newBgpsec.comment = newObject.comment
      }
      this.tryCreate(this.useToken)
    },
    tryCreate (useToken) {
      this.loading = true
      this.createError = null
      this.useToken = useToken
      let promise = axios.getPromise(
        axios.methods.post,
        this.$root.$i18n.locale,
        this.postService,
        useToken,
        this.newBgpsec)
      axios.processPromise(promise,
        this.createSuccessCb,
        this.createErrorCb,
        this.finallyCb)
    },
    createSuccessCb (response) {
      this.createError = null
      this.newObject.asn = null
      this.newObject.ski = null
      this.newObject.routerPublicKey = null
      this.newObject.comment = null
      this.$refs[this.modalId].hide()
      this.successCallback(response)
      this.$refs[this.successModalId].show()
    },
    createErrorCb (error) {
      this.createError = error
      if (!this.$refs[this.modalId].visible) {
        this.$refs[this.modalId].show()
      }
      this.callLogin()
    },
    finallyCb () {
      this.loading = false
    },
    callLogin () {
      this.checkAuth(this.createError, this.tryCreate, this.createErrorCb)
    }
  },
  computed: {
    modalId: function () {
      return this.bgpsecType + 'addModal'
    },
    successModalId: function () {
      return this.bgpsecType + 'successAddModal'
    },
    showRouterPublicKey: function () {
      return this.bgpsecType === 'assertion'
    },
    asnState: function () {
      if (this.newObject.asn) {
        return this.newObject.asn >= this.validationRules.asn.min &&
               this.newObject.asn <= this.validationRules.asn.max
      } else if (this.showRouterPublicKey) {
        return false
      }
      return null
    },
    skiState: function () {
      if (this.newObject.ski && this.newObject.ski.length > 0) {
        return this.validationRules.ski.regex.test(this.newObject.ski)
      } else if (this.showRouterPublicKey) {
        return false
      }
      return null
    },
    routerPublicKeyState: function () {
      if (this.showRouterPublicKey && this.newObject.routerPublicKey) {
        // TODO Perhaps run more validations?
        return true
      }
      return false
    },
    commentState: function () {
      if (!this.newObject.comment) {
        return false
      }
      return this.newObject.comment.length >= this.validationRules.comment.min &&
             this.newObject.comment.length <= this.validationRules.comment.max
    },
    validObject: function () {
      // Validate ASN and SKI first
      if (!this.showRouterPublicKey) {
        if ((this.asnState === false || this.skiState === false) ||
            (this.asnState === null && this.skiState === null)) {
          return false
        }
      } else {
        if (this.asnState !== true || this.skiState !== true) {
          return false
        }
      }
      // Now the rest of the fields
      if (this.showRouterPublicKey && this.routerPublicKeyState === false) {
        return false
      }
      return this.commentState === true
    }
  },
  mixins: [apiPropsMixin, validationsMixin]
}
</script>

<style>
</style>
