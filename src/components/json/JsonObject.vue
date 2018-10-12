<template>
  <b-container fluid>
    <json-value v-for="(value, key) in object"
                :key="key"
                :property="key"
                :value="value"
                :father="getFatherId(key)">
    </json-value>
  </b-container>
</template>

<script>
export default {
  props: {
    object: Object,
    father: {
      type: String,
      default: null
    }
  },
  data () {
    return {}
  },
  methods: {
    getFatherId: function (key) {
      return this.father !== null ? this.father + '.' + this.key : null
    }
  }
}
</script>

<style>
</style>
