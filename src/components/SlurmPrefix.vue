<template>
  <b-container>
    <b-button-group>
      <b-button
        v-for="tab in tabs"
        :key="tab"
        :class="{active: currentTab === tab}"
        v-on:click="currentTab = tab"
        variant="outline-secondary">
        {{ $t('slurm.' + tab + '.title') }}
      </b-button>
    </b-button-group>
    <keep-alive>
      <component :is="selectedTab"></component>
    </keep-alive>
  </b-container>
</template>

<script>
import Filter from '@/components/slurm/prefix/Filter.vue'
import Assertion from '@/components/slurm/prefix/Assertion.vue'

export default {
  components: {
    'prefix-filter': Filter,
    'prefix-assertion': Assertion
  },
  data () {
    return {
      currentTab: null,
      tabs: ['filter', 'assertion']
    }
  },
  created: function () {
    this.currentTab = 'filter'
  },
  computed: {
    selectedTab: function () {
      return 'prefix-' + this.currentTab
    }
  }
}
</script>

<style>
</style>
