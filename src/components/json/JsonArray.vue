<template>
  <b-container fluid>
    <span v-if="!array || array.length < 1" class="noElements">
      {{ $t('common.noElements') }}
    </span>
    <span v-else v-for="(value, index) in array" :key="index">
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
.noElements {
  font-style: italic;
  font-size: 0.9em
}
</style>
