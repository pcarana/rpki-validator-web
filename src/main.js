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
      title: 'TAL detail',
      general: {
        title: 'General data',
        uris: 'URIs',
        loadedCer: 'Loaded certificate'
      },
      files: {
        title: 'Files summary',
        valid: 'Valid',
        warning: 'Warning',
        error: 'Error',
        total: 'Total'
      }
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
      prefix: {
        title: 'SLURM Prefix',
        description: 'These are the prefixes configured at the SLURM file, either as Filters or Assertions'
      },
      bgpsec: {
        title: 'SLURM BGPsec',
        description: 'These are the BGPsec rules configured at the SLURM file, either as Filters or Assertions'
      },
      filter: {
        title: 'Filter',
        addNew: 'Add new filter'
      },
      assertion: {
        title: 'Assertion',
        addNew: 'Add new assertion'
      },
      object: {
        bgpsec: 'BGPsec object',
        prefix: 'Prefix object'
      },
      general: {
        title: 'SLURM loaded',
        description: 'This is a preview of the SLURM loaded at the validator'
      }
    },
    validate: {
      title: 'Validate',
      description: 'Simulate the validation result of a route announcement according to the rules of RFC 6483, the result will be the Route\'s Validity State',
      request: 'Validate',
      status: 'Status',
      validityState: 'Route\'s Validity State',
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
      ski: 'SKI',
      publicKey: 'Public key',
      routerPublicKey: 'Router public key',
      hexValue: 'Hexadecimal value',
      derFormat: 'DER format base64 encoded',
      comment: 'Comment',
      add: 'Add',
      cancel: 'Cancel',
      createSuccess: 'Object successfully created!',
      delete: 'Delete',
      confirm: 'Confirmation',
      confirmDelete: 'Do you wish to delete the following object?',
      deleteSuccess: 'Object successfully deleted!',
      loading: 'Loading...',
      element: 'Element #{n}'
    },
    filter: {
      placeholder: 'Filter...',
      clean: 'Clean',
      all: 'All'
    },
    general: {
      return: 'Return',
      displaying: 'Displaying from {from} to {to} of {total}',
      maxResults: 'Max rows',
      showDetail: 'Show detail'
    },
    login: {
      username: 'Username',
      password: 'Password'
    },
    errors: {
      noDataFound: 'No data found',
      asnOrPrefixRequired: 'An ASN or a prefix is required',
      asnOrSkiRequired: 'An ASN or a SKI is required',
      checkErrors: 'To continue, check the errors indicated at the form',
      asnInvalid: 'Invalid ASN',
      prefixInvalid: 'Must be a valid IP block',
      prefixLengthInvalid: 'Must be between {min} and {max}',
      prefixMaxLengthGt: 'Must be greater than or equal to the prefix length',
      skiInvalid: 'Must be a valid hexadecimal value of 40 characters',
      routerPublicKeyInvalid: 'Must be a valid public key in DER format base64 encoded',
      commentInvalid: 'Must have between {min} and {max} characters',
      usernameRequired: 'Username required',
      passwordRequired: 'Password required',
      invalidCredentials: 'Invalid username/password',
      tryLogin: 'try to login',
      tryAgain: 'try again',
      http: {
        badRequest: {
          title: 'Bad request to the server',
          message: 'The request made to the server isn\'t valid'
        },
        unauthorized: {
          title: 'Unauthorized',
          message: 'The requested service needs authentication'
        },
        notFound: {
          title: 'Object not found',
          message: 'The server didn\'t found the searched object or service'
        },
        methodNotAllowed: {
          title: 'Not allowed',
          message: 'The operation isn\'t allowed at the server'
        },
        conflict: {
          title: 'Conflict',
          message: 'There was a conflict performing the action'
        },
        internalServer: {
          title: 'Server error',
          message: 'There was an error at the server'
        },
        default: {
          title: 'Communication error',
          message: 'There was an error communicating with the server'
        }
      },
      request: {
        incomplete: {
          title: 'Local error',
          message: 'There was a local error before sending the request to the server'
        }
      },
      serverMessage: 'The server sent the message: \'{serverMessage}\''
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
    }
  }
})

Vue.component('json-value', () => import('./components/json/JsonValue.vue'))
Vue.component('json-object', () => import('./components/json/JsonObject.vue'))
Vue.component('json-array', () => import('./components/json/JsonArray.vue'))
Vue.component('json-array-value', () => import('./components/json/JsonArrayValue.vue'))

/* eslint-disable no-new */
var vm = new Vue({
  i18n,
  router,
  components: { App },
  template: '<App/>'
})

vm.$mount('#app')
