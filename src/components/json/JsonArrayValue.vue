<template>
  <b-container>
      <span v-if="type === null">
        {{ value }}
      </span>
      <span v-else>
        <b-button :id="'btn.' + toggleId"
                  :pressed.sync="togglePressed"
                  v-b-toggle="toggleId"
                  size="sm"
                  variant="outline-primary">
          <img v-if="!togglePressed" src="@/assets/plus_icon.svg" width="12" height="12" alt="+" />
          <img v-else src="@/assets/less_icon.svg" width="12" height="12" alt="-" />
        </b-button>
        <b-collapse :id="toggleId">
          <json-array v-if="type === 'array'"
                      :array="value"
                      :father="toggleId">
          </json-array>
          <json-object v-else
                      :object="value"
                      :father="toggleId">
          </json-object>
        </b-collapse>
      </span>
  </b-container>
</template>

<script>
export default {
  props: {
    index: Number,
    value: [String, Number, Object, Array],
    father: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      togglePressed: false
    }
  },
  computed: {
    type: function () {
      if (this.value instanceof Array) {
        return 'array'
      }
      if (this.value instanceof Object) {
        return 'object'
      }
      return null
    },
    toggleId: function () {
      return this.father !== null ? this.father + '.' + this.index : this.index
    }
  }
}
</script>

<style>
</style>
