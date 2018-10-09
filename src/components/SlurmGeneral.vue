<template>
  <b-container class="mt-2 mx-4">
    <h1>{{ $t('slurm.general.title') }}</h1>
    <p>{{ $t('slurm.general.description') }}</p>
    <b-card>
      <span v-if="loading">
        <i>{{ $t('common.loading') }}</i>
        <b-progress :value="100"
                    variant="warning"
                    striped
                    animated
                    class="mb-3">
        </b-progress>
      </span>
      <span v-else>
        <json-object :object="slurm"></json-object>
      </span>
    </b-card>
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
      showCollapse: true,
      loading: null
    }
  },
  methods: {
    loadList () {
      this.loading = true
      axios.get(this.$root.$i18n.locale,
        config.api.services.get.slurmGeneral,
        this.successCb,
        this.errorCb,
        this.eventHub)
    },
    successCb (response) {
      this.slurm = response.data
      this.loading = false
    },
    errorCb (error) {
      this.error = error
      this.loading = false
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
