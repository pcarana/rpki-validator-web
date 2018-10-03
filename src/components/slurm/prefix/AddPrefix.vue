<template>
  <span>
    <b-button v-b-modal.createModal>
      {{ $t('slurm.filter.addNew') }}
    </b-button>
    <b-modal
      id="createModal"
      ref="createModal"
      @shown="focusFirstField"
      :title="$t('slurm.filter.addNew')"
      :ok-title="$t('common.add')"
      :cancel-title="$t('common.cancel')"
      @ok="sendRequest"
      no-close-on-backdrop>
      <b-container fluid>
        <b-row class="mb-1" v-if="createError">
          <b-col>
            <b-alert show variant="danger"><span v-html="createErrorMessage"></span></b-alert>
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
      <h2>Object successfully created!!</h2>
    </b-modal>
  </span>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  props: {
    successCallback: Function,
    prefixType: String
  },
  data () {
    return {
      newObject: {
        asn: null,
        prefix: null,
        prefixLength: null,
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
      this.newObject.comment = null
      this.$refs.asn.focus()
    },
    sendRequest (event) {
      event.preventDefault()
      let newObject = this.newObject
      if (!this.validObject) {
        let validationMessage = 'errors.checkErrors'
        if (!this.newObject.asn && !this.newObject.prefix) {
          validationMessage = 'errors.asnOrPrefixRequired'
        }
        this.createError = { validationMessage: validationMessage }
        return
      }
      let newFilter = {}
      newFilter.asn = parseInt(newObject.asn)
      newFilter.prefix = newObject.prefix + '/' + newObject.prefixLength
      newFilter.comment = newObject.comment
      axios.post(this.$root.$i18n.locale,
        config.api.services.post.slurmPrefixFilter,
        newFilter,
        null,
        this.createSuccessCb,
        this.createErrorCb,
        this.eventHub)
    },
    createSuccessCb (response) {
      this.$refs.createModal.hide()
      this.successCallback(response)
      this.$refs.successModal.show()
    },
    createErrorCb (error) {
      // Show the error
      this.createError = error
    }
  },
  computed: {
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
            list += '<li><b>' + this.i18n.t(this.apiPropsMap.SlurmPrefix[currErr.title.split('.')[1]])
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
      }
      return null
    },
    prefixState: function () {
      if (this.newObject.prefix && this.newObject.prefix.length > 0) {
        return this.validationRules.prefix.ipv4Regex.test(this.newObject.prefix) ||
               this.validationRules.prefix.ipv6Regex.test(this.newObject.prefix)
      }
      return null
    },
    prefixLengthState: function () {
      if (this.newObject.prefixLength) {
        return this.newObject.prefixLength >= this.prefixLengthMin &&
               this.newObject.prefixLength <= this.prefixLengthMax
      }
      return this.newObject.prefix && this.newObject.prefix.length > 0 ? false : null
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
    validObject: function () {
      let fullPrefixState = false
      if (this.prefixState === null && this.prefixLengthState === null) {
        fullPrefixState = null
      } else if (this.prefixState === true && this.prefixLengthState === true) {
        fullPrefixState = true
      }
      // Validate ASN and prefix first
      if ((this.asnState === false || fullPrefixState === false) ||
          (this.asnState === null && fullPrefixState === null)) {
        return false
      }
      // Now the rest of the fields
      return this.commentState === true
    }
  }
}
</script>

<style>
</style>
