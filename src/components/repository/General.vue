<template>
  <b-container class="d-inline-block general p-4">
    <b-row>
      <b-col>
        <b>{{ $t('repository.general.name') }}</b>
        <p class="pl-2 mb-1">{{ tal.name }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b>{{ $t('repository.general.uris') }}</b>
        <p class="pl-2 mb-1" v-for="uri in tal.uris" :key="uri.location">
          {{ uri.location}}
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b>{{ $t('common.publicKey') }}</b>
        <p class="pl-2 mb-1">{{ tal.publicKey }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b>{{ $t('repository.general.loadedCer') }}</b>
        <json-object :object="tal.loadedCer"></json-object>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    tal: {
      type: Object,
      default: null
    }
  },
  data () {
    return {}
  },
  watch: {
    tal: function (val, oldVal) {
      return val
    }
  }
}
</script>

<style>
.general {
  word-wrap: break-word
}
</style>
