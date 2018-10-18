<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col cols="12">
        <h1>{{ $t('slurm.prefix.title') }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <p>{{ $t('slurm.prefix.description') }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
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
          <component :is="selectedTab" class="tab px-0 py-2"></component>
        </keep-alive>
      </b-col>
    </b-row>
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
.tab {
  border: 1px solid #bbbbbb;
}
</style>
