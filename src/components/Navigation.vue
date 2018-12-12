<template>
  <b-navbar toggeable="md" type="dark" id="mainNav" toggleable>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand to="/">
      <img src="@/assets/logo.png" width="30" height="30" class="d-inline-block align-top">
      RPKI Validator
    </b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <span v-for="item in navItems" :key="item.name">
          <b-nav-item v-if="!item.sub" :active="$route.path.startsWith(item.to)" :to="item.to">
            {{ $t(item.name) }}
          </b-nav-item>
          <b-nav-item-dropdown v-if="item.sub" :text="$t(item.name)" :class="{active: $route.path.startsWith(item.to)}">
            <b-dropdown-item v-for="sub in item.sub" :key="sub.name" :active="$route.path === sub.to" :to="sub.to">{{ $t(sub.name) }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </span>
        <b-nav-item v-if="needsUpdate" :href="githubRepo" target="_blank">
          <b-badge variant="dark">
            {{ $t('modules.appUpdate') }}
          </b-badge>
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" v-if="langItems && langItems.length > 1">
        <b-nav-item-dropdown :text="$t('language')" href="#">
          <b-dropdown-item v-for="lang in langItems" :key="lang.id" :active="isActiveLang(lang.id)" href="#" @click="switchLang(lang.id)">
            {{ lang.label }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      navItems: [
        {
          to: '/repositories',
          name: 'modules.repositories'
        },
        { to: '/roa', name: 'modules.roa' },
        {
          to: '/slurm',
          name: 'modules.slurm.main',
          sub: [
            {
              to: '/slurm/general',
              name: 'modules.slurm.general'
            },
            {
              to: '/slurm/prefix',
              name: 'modules.slurm.prefix'
            },
            {
              to: '/slurm/bgpsec',
              name: 'modules.slurm.bgpsec'
            }
          ]
        },
        { to: '/validate', name: 'modules.validate' }
      ],
      langItems: config.supportedLangs,
      needsUpdate: false
    }
  },
  methods: {
    checkAppUpdate: function () {
      let promise = axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        config.githubLatest,
        null)
      promise.then((response) => {
        this.needsUpdate = response.data.tag_name !== config.appVersion
      }).catch((error) => {
        console.warn('Couldn\'t check for updates, got the error: ' + JSON.stringify(error))
      })
    }
  },
  computed: {
    githubRepo: function () {
      return config.githubRepo
    }
  },
  created: function () {
    this.checkAppUpdate()
    setInterval(this.checkAppUpdate, config.checkAppUpdatesMs)
  }
}
</script>

<style>
#mainNav {
    background-color: #da7e07;
}
.subNav {
    background-color: #d89946;
}
</style>
