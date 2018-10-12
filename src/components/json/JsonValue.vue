<template>
    <b-row>
      <b-col cols="1" class="text-right">
        <span v-if="type !== null">
          <b-button :id="'btn.' + toggleId"
                    :pressed.sync="togglePressed"
                    v-b-toggle="toggleId"
                    size="sm"
                    variant="outline-primary">
            <img v-if="!togglePressed" src="@/assets/plus_icon.svg" width="12" height="12" alt="+" />
            <img v-else src="@/assets/less_icon.svg" width="12" height="12" alt="-" />
          </b-button>
        </span>
        <div v-else class="emptyBlock">
        </div>
      </b-col>
      <b-col cols="11">
        <b>{{ property }}</b>
        <span v-if="type === null">: {{ value }}</span>
        <span v-else>
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
    property: String,
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
      return this.father !== null ? this.father + '.' + this.property : this.property
    }
  }
}
</script>

<style>
.emptyBlock {
  display: block;
  height: 12;
  width: 12;
}
</style>
