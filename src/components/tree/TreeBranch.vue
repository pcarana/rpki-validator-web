<template>
  <b-col class="branch" :cols="cols">
    <b-container fluid :key="level">
      <tree-element v-for="(element, index) in elements" :key="element.subjectKeyIdentifier"
                    :index="index"
                    :object="element"
                    :onClick="expandElement"
                    :selected="element.selected ? true : false"
                    :loading="element.loading ? true : false">
      </tree-element>
    </b-container>
  </b-col>
</template>

<script>
import axios from '@/axios'
import config from '@/config'

export default {
  props: {
    elements: {
      type: Array,
      default: function () {
        return []
      }
    },
    level: {
      type: Number,
      default: 0
    },
    cols: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      childElements: null,
      selected: []
    }
  },
  methods: {
    expandElement (event, index, parentId) {
      for (let i = 0; i < this.elements.length; i++) {
        this.$set(this.elements[i], 'selected', false)
      }
      this.$set(this.elements[index], 'loading', true)
      if (!this.elements[index].childs) {
        let me = this
        let service = config.api.services.get.treeChild.replace(
          ':id',
          parentId
        )
        let promise = axios.getPromise(
          axios.methods.get,
          this.$root.$i18n.locale,
          service,
          null)
        promise.then(function (response) {
          me.elements[index].childs = response.data.childs
          me.$set(me.elements[index], 'selected', true)
          me.childElements = response.data.childs
          me.$emit('add-branch', { level: me.level + 1, elements: me.childElements })
        }).catch(function (error) {
          me.$emit('error', { level: me.level + 1, error: error })
        }).finally(function () {
          me.$set(me.elements[index], 'loading', false)
        })
      } else {
        this.childElements = this.elements[index].childs
        this.$set(this.elements[index], 'selected', true)
        this.$set(this.elements[index], 'loading', false)
        this.$emit('add-branch', { level: this.level + 1, elements: this.childElements })
      }
    }
  }
}
</script>

<style>
.branch {
  height: inherit;
  overflow-y: auto;
}
</style>