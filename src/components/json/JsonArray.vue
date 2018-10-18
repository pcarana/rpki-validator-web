<template>
  <b-container fluid>
    <span v-for="(value, index) in array" :key="index">
      <json-array-value :index="index"
                        :value="value"
                        :father="getFatherId(index)">
      </json-array-value>
    </span>
  </b-container>
</template>

<script>
export default {
  props: {
    array: Array,
    father: {
      type: String,
      default: null
    }
  },
  data () {
    return {}
  },
  methods: {
    getFatherId: function (index) {
      return this.father !== null ? this.father + '.' + index : index
    }
  }
}
</script>

<style>
</style>
