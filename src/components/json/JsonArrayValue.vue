<template>
  <b-row class="my-auto align-middle">
    <b-col cols="12" class="text-left">
      <span v-if="type === null" class="value">
        {{ value }}
      </span>
      <span v-else>
        <b-button :id="'btn.' + toggleId"
                  :pressed.sync="togglePressed"
                  v-b-toggle="toggleId"
                  size="sm"
                  variant="link"
                  class="arrayProp pl-0">
          <img v-if="!togglePressed" src="@/assets/plus_icon.svg" width="8" height="8" alt="+" />
          <img v-else src="@/assets/less_icon.svg" width="8" height="8" alt="-" />
          {{ $t('common.element', { n: index + 1 }) }}
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
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    index: Number,
    value: [String, Number, Boolean, Date, Object, Array],
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
.arrayProp {
  font-weight: bold;
  font-style: italic;
  color: black;
  font-size: 0.9em
}
.value {
  font-size: 0.9em;
}
</style>
