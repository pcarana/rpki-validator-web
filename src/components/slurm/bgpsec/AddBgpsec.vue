<template>
  <span>
    <b-button v-b-modal.createModal>
      {{ $t(addButtonLabel) }}
    </b-button>
    <b-modal
      id="createModal"
      ref="createModal"
      @shown="focusFirstField"
      :title="$t(addButtonLabel)"
      :ok-title="$t('common.add')"
      :cancel-title="$t('common.cancel')"
      @ok="sendRequest"
      no-close-on-backdrop>
      <b-container fluid>
        <b-row class="mb-1" v-if="createError">
          <b-col>
            <b-alert show variant="danger">
              <span v-html="createErrorMessage"></span>
            </b-alert>
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
      id="successModal"
      ref="successModal"
      ok-only>
      <h2>{{ $t('common.createSuccess') }}</h2>
    </b-modal>
  </span>
</template>

<script>
import axios from '@/axios'

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
      createError: null
    }
  },
  methods: {
    focusFirstField () {
      this.createError = null
      this.newObject.asn = null
      this.newObject.ski = null
      this.newObject.routerPublicKey = null
      this.newObject.comment = null
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
      let newBgpsec = {}
      if (newObject.asn) {
        newBgpsec.asn = parseInt(newObject.asn)
      }
      if (newObject.ski) {
        newBgpsec.SKI = btoa(newObject.ski).replace(/=/g, '')
      }
      if (this.showRouterPublicKey && newObject.routerPublicKey) {
        newBgpsec.routerPublicKey = newObject.routerPublicKey
      }
      if (newObject.comment) {
        newBgpsec.comment = newObject.comment
      }
      axios.post(this.$root.$i18n.locale,
        this.postService,
        newBgpsec,
        this.createSuccessCb,
        this.createErrorCb)
    },
    createSuccessCb (response) {
      this.$refs.createModal.hide()
      this.successCallback(response)
      this.$refs.successModal.show()
    },
    createErrorCb (error) {
      this.createError = error
    }
  },
  computed: {
    showRouterPublicKey: function () {
      return this.bgpsecType === 'assertion'
    },
    createErrorMessage: function () {
      let error = this.createError
      if (!error) {
        return null
      }
      // Get code
      if (error.response && error.response.status === 400 && error.response.data.message) {
        let createErrorMessage = error.response.data.message
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          let list = '<ul>'
          for (let currErr of error.response.data.errors) {
            let errorSplit = currErr.title.split('.')
            let message = ''
            if (errorSplit.length > 1) {
              message = this.i18n.t(this.apiPropsMap.SlurmBgpsec[errorSplit[1]])
            } else {
              message = this.i18n.t(this.apiPropsMap.SlurmBgpsec.object)
            }
            list += '<li><b>' + message
            list += ':</b> ' + currErr.description + '</li>'
          }
          list += '</ul>'
          createErrorMessage += list
        }
        return createErrorMessage
      } else if (error.validationMessage) {
        return this.i18n.t(error.validationMessage)
      }
      return error
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
  }
}
</script>

<style>
</style>
