<template>
  <div>
    <b-container fluid>
      <b-row class="my-3">
        <b-col cols="12">
          <h1>{{ $t('repository.title') }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="10">
          <loading :show="loading"></loading>
          <error-display :error="error" :callLogin="callLogin" :callRetry="loadData"></error-display>
        </b-col>
      </b-row>
      <b-row v-if="tal">
        <b-col>
          <b-button-group>
            <b-button
              v-for="tab in tabs"
              :key="tab"
              :class="{active: currentTab === tab}"
              v-on:click="currentTab = tab"
              variant="outline-secondary">
              {{ $t(getTabTitle(tab)) }}
            </b-button>
          </b-button-group>
          <transition name="fade">
            <keep-alive>
              <component :is="currentTab" :tal="tal" class="tab px-2 py-2"></component>
            </keep-alive>
          </transition>
        </b-col>
      </b-row>
    </b-container>
    <b-button class="ml-2 mt-2" @click="back">{{ $t('general.return') }}</b-button>
  </div>
</template>

<script>
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import General from '@/components/repository/General.vue'
import FilesValidation from '@/components/repository/FilesValidation.vue'
import Loading from '@/components/common/Loading.vue'
import Explorer from '@/components/tree/Explorer.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  props: {
    id: Number | String
  },
  data () {
    return {
      tal: null,
      error: null,
      loading: false,
      currentTab: null,
      tabs: ['files-validation', 'general', 'tree-explorer'],
      useToken: false
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading,
    'files-validation': FilesValidation,
    'general': General,
    'tree-explorer': Explorer
  },
  methods: {
    back () {
      this.$router.back()
    },
    getTabTitle (tab) {
      switch (tab) {
        case 'files-validation':
          return 'repository.validations.title'
        case 'general':
          return 'repository.general.title'
        case 'tree-explorer':
          return 'repository.general.certificationTree'
        default:
          return ''
      }
    },
    loadData (useToken) {
      this.error = null
      this.loading = true
      this.useToken = useToken
      let service = config.api.services.get.talDetail.replace(
        ':id',
        this.id
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
      this.tal = response.data
    },
    errorCb (error) {
      this.error = error
      this.tal = null
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
    this.currentTab = 'files-validation'
  },
  watch: {
    id: function (newId, oldId) {
      this.loadData(this.useToken)
      this.currentTab = 'files-validation'
    }
  }
}
</script>

<style>
.tab {
  border: 1px solid #bbbbbb;
}
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
