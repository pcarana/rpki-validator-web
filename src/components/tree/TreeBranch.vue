<template>
  <b-col class="branch" :cols="cols">
    <b-container fluid :key="level">
      <tree-element v-for="(element, index) in localElements" :key="element.subjectKeyIdentifier"
                    :index="index"
                    :parentIndex="level"
                    :object="element"
                    :onClick="expandElement"
                    :selected="element.selected ? true : false"
                    :loading="element.loading ? true : false">
      </tree-element>
      <b-row class="my-1" v-if="loadMoreElements">
        <b-col>
          <b-button @click="loadNextPage" class="load-more" :disabled="loadingMore">
            <span v-if="!loadingMore">{{ $t('common.loadMore') }}</span>
            <img v-else src="@/assets/circular_spinner.gif" alt="..." height="14" width="14" />
          </b-button>
        </b-col>
      </b-row>
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
    },
    parentId: {
      type: Number,
      default: 0
    },
    childCount: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      childElements: null,
      selected: [],
      localElements: [],
      offset: 0,
      loadingMore: false
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
          null,
          { limit: this.limit, offset: 0 })
        promise.then(function (response) {
          me.childElements = response.data.childs
          me.$set(me.elements[index], 'childs', response.data.childs)
          me.$set(me.elements[index], 'childCount', response.data.childCount)
          me.$set(me.elements[index], 'selected', true)
          me.$emit('add-branch', {
            level: me.level + 1,
            elements: me.childElements
          },
          response.data.childCount,
          response.data.id,
          index)
        }).catch(function (error) {
          me.$emit('error', { level: me.level + 1, error: error })
        }).finally(function () {
          me.$set(me.elements[index], 'loading', false)
        })
      } else {
        this.childElements = this.elements[index].childs
        this.$set(this.elements[index], 'selected', true)
        this.$set(this.elements[index], 'loading', false)
        this.$emit('add-branch', {
          level: this.level + 1,
          elements: this.childElements
        },
        this.elements[index].childCount,
        parentId,
        index)
      }
    },
    loadNextPage (event) {
      event.preventDefault()
      let me = this
      let service = config.api.services.get.treeChild.replace(
        ':id',
        this.parentId
      )
      this.offset = this.offset + 1
      this.loadingMore = true
      let promise = axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        service,
        null,
        { limit: this.limit, offset: this.offset * this.limit })
      promise.then(function (response) {
        me.localElements = me.localElements.concat(response.data.childs)
        me.$emit('add-next-page', me.level, response.data.childs, me.parentId)
      }).catch(function (error) {
        me.$emit('error', { level: me.level, error: error })
      }).finally(function () {
        me.loadingMore = false
      })
    }
  },
  computed: {
    loadMoreElements: function () {
      return this.childCount > this.localElements.length
    }
  },
  created: function () {
    this.localElements = this.elements
  },
  watch: {
    elements: function (newElements, oldElements) {
      this.localElements = newElements
    }
  }
}
</script>

<style>
.branch {
  height: inherit;
  max-height: inherit;
  overflow-y: auto;
}

.load-more {
  width: 100%;
}
</style>
