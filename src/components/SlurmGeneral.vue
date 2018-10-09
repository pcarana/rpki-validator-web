<template>
  <b-container>
    <json-object :object="slurm"></json-object>
  </b-container>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  data () {
    return {
      slurm: null,
      eventHub: null,
      error: null,
      showCollapse: true
    }
  },
  methods: {
    loadList () {
      axios.get(this.$root.$i18n.locale,
        config.api.services.get.slurmGeneral,
        this.successCb,
        this.errorCb,
        this.eventHub)
    },
    successCb (response) {
      this.slurm = response.data
    },
    errorCb (error) {
      this.error = error
      // Show the error
    }
  },
  created: function () {
    this.loadList()
  }
}
</script>

<style>
</style>
