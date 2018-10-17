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
          <b-col cols="2"><label for="prefix">{{ $t('common.prefix') }}</label></b-col>
          <b-col>
            <b-form-group id="prefixGroup">
              <b-form-input id="prefix"
                ref="prefix"
                type="text"
                v-model.trim="newObject.prefix"
                :state="prefixState">
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t('errors.prefixInvalid') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2"><label for="prefixLength">{{ $t('common.prefixLength') }}</label></b-col>
          <b-col>
            <b-form-group id="prefixLengthGroup">
              <b-form-input id="prefixLength"
                ref="prefixLength"
                type="number"
                v-model="newObject.prefixLength"
                :min="prefixLengthMin"
                :max="prefixLengthMax"
                :state="prefixLengthState">
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t('errors.prefixLengthInvalid', { min: prefixLengthMin, max: prefixLengthMax }) }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-1" v-if="showMaxLength">
          <b-col cols="2">
            <label for="prefixMaxLength">{{ $t('common.prefixMaxLength') }}</label>
          </b-col>
          <b-col>
            <b-form-group id="prefixMaxLengthGroup">
              <b-form-input id="prefixMaxLength"
                ref="prefixMaxLength"
                type="number"
                v-model="newObject.prefixMaxLength"
                :min="prefixLengthMin"
                :max="prefixLengthMax"
                :state="prefixMaxLengthState">
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t(prefixMaxLengthMessage, { min: prefixLengthMin, max: prefixLengthMax }) }}
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
    prefixType: String,
    addButtonLabel: String,
    postService: String
  },
  data () {
    return {
      newObject: {
        asn: null,
        prefix: null,
        prefixLength: null,
        prefixMaxLength: null,
        comment: null
      },
      createError: null
    }
  },
  methods: {
    focusFirstField () {
      this.createError = null
      this.newObject.asn = null
      this.newObject.prefix = null
      this.newObject.prefixLength = null
      this.newObject.prefixMaxLength = null
      this.newObject.comment = null
      this.$refs.asn.focus()
    },
    sendRequest (event) {
      event.preventDefault()
      let newObject = this.newObject
      if (!this.validObject) {
        let validationMessage = 'errors.checkErrors'
        if (!this.showMaxLength && !this.newObject.asn && !this.newObject.prefix) {
          validationMessage = 'errors.asnOrPrefixRequired'
        }
        this.createError = { validationMessage: validationMessage }
        return
      }
      let newPrefix = {}
      if (newObject.asn) {
        newPrefix.asn = parseInt(newObject.asn)
      }
      let prefix = ''
      if (newObject.prefix) {
        prefix += newObject.prefix
      }
      if (newObject.prefixLength) {
        prefix += '/' + newObject.prefixLength
      }
      if (prefix.length > 0) {
        newPrefix.prefix = prefix
      }
      if (this.showMaxLength && newObject.prefixMaxLength) {
        newPrefix.maxPrefixLength = parseInt(newObject.prefixMaxLength)
      }
      if (newObject.comment) {
        newPrefix.comment = newObject.comment
      }
      axios.post(this.$root.$i18n.locale,
        this.postService,
        newPrefix,
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
    showMaxLength: function () {
      return this.prefixType === 'assertion'
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
              message = this.i18n.t(this.apiPropsMap.SlurmPrefix[errorSplit[1]])
            } else {
              message = this.i18n.t(this.apiPropsMap.SlurmPrefix.object)
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
      } else if (this.showMaxLength) {
        return false
      }
      return null
    },
    prefixState: function () {
      if (this.newObject.prefix && this.newObject.prefix.length > 0) {
        return this.validationRules.prefix.ipv4Regex.test(this.newObject.prefix) ||
               this.validationRules.prefix.ipv6Regex.test(this.newObject.prefix)
      } else if (this.showMaxLength) {
        return false
      }
      return null
    },
    prefixLengthState: function () {
      if (this.newObject.prefixLength) {
        return this.newObject.prefixLength >= this.prefixLengthMin &&
               this.newObject.prefixLength <= this.prefixLengthMax
      } else if (this.showMaxLength) {
        return false
      }
      return this.newObject.prefix && this.newObject.prefix.length > 0 ? false : null
    },
    prefixMaxLengthState: function () {
      if (this.showMaxLength && this.newObject.prefixMaxLength) {
        return this.newObject.prefixMaxLength >= this.prefixLengthMin &&
               this.newObject.prefixMaxLength <= this.prefixLengthMax &&
               this.newObject.prefixMaxLength >= this.newObject.prefixLength
      }
      return null
    },
    commentState: function () {
      if (!this.newObject.comment) {
        return false
      }
      return this.newObject.comment.length >= this.validationRules.comment.min &&
             this.newObject.comment.length <= this.validationRules.comment.max
    },
    prefixLengthMin: function () {
      // Use a common value, if any of the 'min' changes then add here the rules
      return this.validationRules.prefixLength.v4.min
    },
    prefixLengthMax: function () {
      if (this.newObject.prefix && this.newObject.prefix.length > 0) {
        if (this.validationRules.prefix.ipv4Regex.test(this.newObject.prefix)) {
          return this.validationRules.prefixLength.v4.max
        }
      }
      return this.validationRules.prefixLength.v6.max
    },
    prefixMaxLengthMessage: function () {
      if (this.prefixMaxLengthState !== false) {
        return ''
      }
      if (this.newObject.prefixMaxLength < this.prefixLengthMin ||
          this.newObject.prefixMaxLength > this.prefixLengthMax) {
        return 'errors.prefixLengthInvalid'
      }
      // Then the cause is the other condition
      return 'errors.prefixMaxLengthGt'
    },
    validObject: function () {
      let fullPrefixState = false
      if (this.prefixState === null && this.prefixLengthState === null) {
        fullPrefixState = null
      } else if (this.prefixState === true && this.prefixLengthState === true) {
        fullPrefixState = true
      }
      // Validate ASN and prefix first
      if (!this.showMaxLength) {
        if ((this.asnState === false || fullPrefixState === false) ||
            (this.asnState === null && fullPrefixState === null)) {
          return false
        }
      } else {
        if (this.asnState !== true || fullPrefixState !== true) {
          return false
        }
      }
      // Now the rest of the fields
      if (this.showMaxLength && this.prefixMaxLengthState === false) {
        return false
      }
      return this.commentState === true
    }
  }
}
</script>

<style>
</style>
