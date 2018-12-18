// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import config from './config'
import routes from './router'
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
    checkAuth (error, retryCallback, errorCallback) {
      if (error && error.response && error.response.status === 401) {
        let parentComponent = this.$root.$children[0]
        let loginComponent = parentComponent.$refs.loginComponent
        loginComponent.callbackSet = {
          retryCallback: retryCallback,
          errorCallback: errorCallback
        }
        loginComponent.showLoginModal()
      }
    }
  }
})

Vue.component('json-value', () => import('./components/json/JsonValue.vue'))
Vue.component('json-object', () => import('./components/json/JsonObject.vue'))
Vue.component('json-array', () => import('./components/json/JsonArray.vue'))
Vue.component('json-array-value', () => import('./components/json/JsonArrayValue.vue'))

Vue.component('tree-element', () => import('./components/tree/TreeElement.vue'))
Vue.component('tree-branch', () => import('./components/tree/TreeBranch.vue'))

Vue.use(Router)
const router = new Router(routes)

/* eslint-disable no-new */
var vm = new Vue({
  i18n,
  router,
  components: { App },
  template: '<App/>'
})

vm.$mount('#app')
