<template>
  <b-container>
    <span v-for="(value, index) in array" :key="index">
      <json-array-value :index="index"
                        :value="value"
                        :father="father">
      </json-array-value>
      <span v-if="index < array.length - 1">, </span>
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
  }
}
</script>

<style>
</style>
