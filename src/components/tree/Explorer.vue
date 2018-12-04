<template>
  <b-container fluid class="d-inline-block general">
    <b-row v-if="root" class="explorer">
      <b-col :cols="branchCols(0)">
        <b-container fluid>
          <tree-element :index="0" :object="root" selected></tree-element>
        </b-container>
      </b-col>
      <tree-branch
        v-on:add-branch="addBranch"
        v-on:error="grandsonErrorCb"
        v-for="(grandson, index) in grandsons"
        :key="index + 1"
        :elements="grandson"
        :level="index + 1"
        :cols="branchCols(index)">
      </tree-branch>
      <b-col v-if="grandsonError" :cols="branchCols(grandsons.length)">
        <error-display :error="grandsonError"></error-display>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'
import Loading from '@/components/common/Loading.vue'
import axios from '@/axios'
import config from '@/config'

export default {
  props: {
    tal: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      error: null,
      loading: false,
      root: null,
      grandsons: [],
      grandsonError: null
    }
  },
  components: {
    'error-display': ErrorDisplay,
    'loading': Loading
  },
  methods: {
    loadData () {
      this.grandsonError = null
      this.loading = true
      let promise = this.promiseCb(null)
      axios.processPromise(promise,
        this.successCb,
        this.errorCb,
        this.finallyCb)
    },
    promiseCb (auth) {
      let service = config.api.services.get.treeRoot.replace(
        ':id',
        this.tal.id
      )
      return axios.getPromise(
        axios.methods.get,
        this.$root.$i18n.locale,
        service,
        auth)
    },
    successCb (response) {
      this.grandsonError = null
      this.root = response.data
      if (response.data.childs) {
        this.addBranch({ level: 1, elements: response.data.childs })
      }
    },
    errorCb (error) {
      this.grandsonError = error
    },
    finallyCb () {
      this.loading = false
    },
    addBranch (levelData) {
      if (levelData.level) {
        if (this.grandsons.length < levelData.level) {
          this.grandsons.push(levelData.elements)
        } else {
          this.grandsons.pop()
          this.grandsons[levelData.level - 1] = levelData.elements
        }
      }
    },
    grandsonErrorCb (levelData) {
      this.grandsonError = levelData.error
      let removeLevels = this.grandsons.length - levelData.level
      while (removeLevels >= 0) {
        this.grandsons.pop()
        removeLevels--
      }
    },
    branchCols (index) {
      // Consider the root element
      let totalLength = this.grandsons.length + 1 + (this.grandsonError ? 1 : 0)
      let mod = 12 % totalLength
      if (mod === 0) {
        return 12 / totalLength
      }
      let col = Math.abs(12 / totalLength)
      if (index < totalLength - mod) {
        return col
      }
      return col + 1
    }
  },
  mounted () {
    this.loadData()
  },
  watch: {
    tal: function (newTal, oldTal) {
      this.loadData()
    }
  }
}
</script>

<style>
.explorer {
  height: 400px;
}
.general {
  word-wrap: break-word
}
</style>
