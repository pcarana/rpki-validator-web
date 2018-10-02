// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(BootstrapVue)

const messages = {
  en: {
    modules: {
      home: 'Home',
      repositories: 'Repositories',
      roa: 'ROA',
      slurm: {
        main: 'SLURM',
        general: 'Complete',
        prefix: 'Prefix',
        bgpsec: 'BGPsec'
      },
      validate: 'Validate'
    },
    home: {
      title: 'Welcome to the RPKI Validator!',
      welcome: 'Visit the modules to perform distinct actions'
    },
    repositories: {
      title: 'TAL List',
      description: 'These are the TALs configured at the validator',
      name: 'Name',
      uris: 'URIs'
    },
    repository: {
      title: 'TAL {name} detail'
    },
    roas: {
      title: 'ROA List',
      description: 'These are the ROAs loaded from the configured TALs'
    },
    roa: {
      title: 'ROA detail',
      general: {
        title: 'General',
        cms: 'CMS'
      },
      eecert: {
        title: 'EE certificate'
      },
      gbr: {
        title: 'GBRs'
      }
    },
    slurm: {
      filter: 'Filter',
      assertion: 'Assertion'
    },
    validate: {
      title: 'Validate',
      description: 'Simulate the validation result of a ROA according to the rules of RFC 6483, the result will be the Route\'s Validity State',
      request: 'Validate',
      validityState: 'Status',
      roaMatch: 'ROA matched',
      roaClosestMatch: 'Closest ROA matched',
      state: {
        valid: 'Valid',
        invalid: 'Invalid',
        unknown: 'Unknown'
      },
      validityMatrix: {
        nonIntersecting: 'Non intersecting',
        coveringAggregate: 'Covering aggregate',
        matchRoa: 'Match ROA prefix',
        moreSpecific: 'More specific than ROA',
        matchAs: 'Matching',
        nonMatchAs: 'Non matching'
      }
    },
    common: {
      asn: 'ASN',
      prefix: 'Prefix',
      prefixLength: 'Prefix length',
      prefixMaxLength: 'Prefix max length',
      prefixFamily: 'Prefix family',
      action: 'Action',
      publicKey: 'Public key',
      comment: 'Comment'
    },
    filter: {
      placeholder: 'Filter...',
      clean: 'Clean',
      all: 'All'
    },
    general: {
      return: 'Return',
      displaying: 'Displaying {display} results of {total}',
      maxResults: 'Max rows',
      showDetail: 'Show detail'
    },
    errors: {
      noDataFound: 'No data found'
    },
    language: 'Language'
  }
}

const dateTimeFormats = {
  en: {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    }
  },
  es: {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    }
  }
}

const i18n = new VueI18n({
  locale: 'en',
  messages,
  dateTimeFormats
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
    formatObject (object) {
      let formatted = ''
      for (const prop in object) {
        formatted += this.formatProperty(prop, object[prop])
      }
      return formatted
    },
    formatArray (array) {
      let formatted = ''
      for (let value of array) {
        if (value instanceof Array) {
          formatted += this.formatArray(value)
        } else if (value instanceof Object) {
          formatted += this.formatObject(value)
        } else {
          formatted += value + ','
        }
      }
      if (formatted.endsWith(',')) {
        return formatted.substr(0, formatted.length - 1)
      }
      return formatted
    },
    formatProperty (key, value) {
      let formatted = '<div><b>' + key + '</b>: '
      if (value instanceof Array) {
        formatted += '<div class="ml-4">' + this.formatArray(value) + '</div>'
      } else if (value instanceof Object) {
        formatted += '<div class="ml-4">' + this.formatObject(value) + '</div>'
      } else {
        formatted += (value !== null && value !== '' ? value : 'NULL')
      }
      return formatted + '</div>'
    },
    getActiveLang () {
      return i18n.locale
    }
  }
})

/* eslint-disable no-new */
var vm = new Vue({
  i18n,
  router,
  components: { App },
  template: '<App/>'
})

vm.$mount('#app')
