// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import config from './config'
import router from './router'
import labels from './labels'
import VueI18n from 'vue-i18n'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(BootstrapVue)

const i18n = new VueI18n({
  locale: config.locale,
  fallbackLocale: config.fallbackLocale,
  messages: labels.messages,
  dateTimeFormats: labels.dateTimeFormats
})

Vue.mixin({
  data: function () {
    return {
      loginModalId: 'loginModal',
      apiPropsMap: {
        SlurmPrefix: {
          object: 'slurm.object.prefix',
          asn: 'common.asn',
          prefix: 'common.prefix',
          maxPrefixLength: 'common.prefixMaxLength',
          comment: 'common.comment'
        },
        SlurmBgpsec: {
          object: 'slurm.object.bgpsec',
          asn: 'common.asn',
          SKI: 'common.ski',
          routerPublicKey: 'common.routerPublicKey',
          comment: 'common.comment'
        }
      },
      validationRules: {
        asn: {
          min: 1,
          max: 4294967295
        },
        prefix: {
          ipv4Regex: /(^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)/,
          ipv6Regex: /(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$)/
        },
        prefixLength: {
          v4: {
            min: 0,
            max: 32
          },
          v6: {
            min: 0,
            max: 128
          }
        },
        ski: {
          regex: /^([0-9a-fA-F]{40})$/
        },
        comment: {
          min: 1,
          max: 2000
        }
      },
      i18n: i18n
    }
  },
  methods: {
    switchLang (newLang) {
      i18n.locale = newLang
      localStorage.setItem('lang', i18n.locale)
    },
    isActiveLang (langId) {
      return i18n.locale === langId
    },
    getActiveLang () {
      return i18n.locale
    },
    checkAuth (error, promiseCallback, successCallback, errorCallback) {
      if (error && error.response && error.response.status === 401) {
        this.showLogin(promiseCallback, successCallback, errorCallback)
      }
    },
    showLogin (promiseCallback, successCallback, errorCallback) {
      let parentComponent = this.$root.$children[0]
      let loginComponent = parentComponent.$refs.loginComponent
      loginComponent.callbackSet = {
        promiseCallback: promiseCallback,
        successCallback: successCallback,
        errorCallback: errorCallback
      }
      loginComponent.$refs[this.loginModalId].show()
    },
    getNextPage (myAxios, prevData, finalResults, service) {
      let me = this
      return myAxios.get(service, {
        params: {
          limit: prevData.page.limit,
          offset: prevData.page.limit + (prevData.page.offset ? prevData.page.offset : 0)
        }
      }).then(function (response) {
        let data = response.data
        if (data.page.offset + data.page.limit > data.found) {
          return finalResults.concat(data.results)
        }
        return me.getNextPage(myAxios, data, finalResults.concat(data.results), service)
      }).catch(function (error) {
        throw error
      })
    }
  }
})

Vue.component('json-value', () => import('./components/json/JsonValue.vue'))
Vue.component('json-object', () => import('./components/json/JsonObject.vue'))
Vue.component('json-array', () => import('./components/json/JsonArray.vue'))
Vue.component('json-array-value', () => import('./components/json/JsonArrayValue.vue'))

Vue.component('tree-element', () => import('./components/tree/TreeElement.vue'))
Vue.component('tree-branch', () => import('./components/tree/TreeBranch.vue'))

/* eslint-disable no-new */
var vm = new Vue({
  i18n,
  router,
  components: { App },
  template: '<App/>'
})

vm.$mount('#app')
