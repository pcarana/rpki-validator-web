<template>
  <b-container>
    <b-alert
      variant="info"
      dismissible
      :show="show">
      <i>{{ $t('common.loading') }}</i>
      <b-progress :value="100"
                  variant="info"
                  striped
                  animated
                  class="mb-3"
                  height="1rem">
        </b-progress>
    </b-alert>
  </b-container>
</template>

<script>
export default {
  props: {
    show: Boolean
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
