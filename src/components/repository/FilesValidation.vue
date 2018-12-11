<template>
  <b-container fluid>
    <b-row class="mb-4">
      <b-col cols="2"></b-col>
      <b-col cols="8">
        <b-container fluid>
          <b-row class="text-center h5">
            <b-col cols="12">
              {{ $t('repository.files.title') }}
            </b-col>
          </b-row>
          <b-row class="text-center h5">
            <b-col></b-col>
            <b-col>
              <b-badge variant="success">
                {{ $t('repository.files.valid') }}
              </b-badge>
            </b-col>
            <b-col>
              <b-badge variant="warning">
                {{ $t('repository.files.warning') }}
              </b-badge>
            </b-col>
            <b-col>
              <b-badge variant="danger">
                {{ $t('repository.files.error') }}
              </b-badge>
            </b-col>
            <b-col>
              <b-badge variant="dark">
                {{ $t('repository.files.total') }}
              </b-badge>
            </b-col>
          </b-row>
          <b-row :class="{ 'text-center': true, 'font-weight-bold': index === filesSummary.size - 1}"
                  v-for="(fileSummary, index) in Array.from(filesSummary)" :key="fileSummary[0]">
            <b-col class="text-right h6">
              {{fileSummary[0]}}
            </b-col>
            <b-col class="border">{{fileSummary[1].valid}}</b-col>
            <b-col class="border">{{fileSummary[1].warning}}</b-col>
            <b-col class="border">{{fileSummary[1].error}}</b-col>
            <b-col class="border font-weight-bold">
            {{fileSummary[1].valid + fileSummary[1].warning + fileSummary[1].error}}
            </b-col>
          </b-row>
        </b-container>
      </b-col>
      <b-col cols="2"></b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <custom-table :items="validations"
                      :tableFields="tableFields"
                      :filterFunction="filterFunction"
                      :searchFilterOpts="searchFilterOpts"
                      :tableId="tableId">
        </custom-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import CustomTable from '@/components/common/CustomTable.vue'

export default {
  props: {
    tal: {
      type: Object,
      default: null
    }
  },
  components: {
    'custom-table': CustomTable
  },
  data () {
    return {
      tableId: 'validationsTable',
      tableFields: [
        { key: 'fileType', label: 'repository.validations.fileType', sortable: true },
        { key: 'location', label: 'repository.validations.location', sortable: true },
        { key: 'status', label: 'repository.validations.status', sortable: true },
        { key: 'message', label: 'repository.validations.message', sortable: true }
      ],
      searchFilterOpts: [
        { value: 'fileType', text: 'repository.validations.fileType' },
        { value: 'location', text: 'repository.validations.location' },
        { value: 'status', text: 'repository.validations.status' },
        { value: 'message', text: 'repository.validations.message' }
      ]
    }
  },
  methods: {
    addToSummaryMap (check, fileMap, property) {
      let split = check.location.split('.')
      let fileType = split[split.length - 1]
      if (!fileMap.has(fileType)) {
        let values = { valid: 0, warning: 0, error: 0 }
        fileMap.set(fileType, values)
      }
      fileMap.get(fileType)[property] += 1
    },
    addCheckToArray (sourceArr, status, destArr) {
      sourceArr.map((check) => {
        let split = check.location.split('.')
        let fileType = split[split.length - 1]
        destArr.push({
          fileType: fileType,
          location: check.location,
          status: status,
          message: check.message ? check.message : ''
        })
      })
    },
    filterFunction (item, searchFilterOpt, filterItemTxt) {
      var regexp
      try {
        regexp = new RegExp(filterItemTxt, 'i')
      } catch (e) {
        // Wait until the regexp is valid
        return null
      }
      if (item[searchFilterOpt]) {
        return item[searchFilterOpt].match(regexp)
      }
      return item.fileType.match(regexp) || item.location.match(regexp) ||
        item.status.match(regexp) || item.message.match(regexp)
    }
  },
  computed: {
    filesSummary: function () {
      const fileMap = new Map()
      if (!this.tal) {
        return fileMap
      }
      this.tal.validations.filter((v) => {
        return v.status !== 'RUNNING'
      }).map((validation) => {
        validation.checks.passed.map((c) => {
          this.addToSummaryMap(c, fileMap, 'valid')
        })
        validation.checks.warning.map((c) => {
          this.addToSummaryMap(c, fileMap, 'warning')
        })
        validation.checks.error.map((c) => {
          this.addToSummaryMap(c, fileMap, 'error')
        })
        let object = {}
        object.valid = validation.checks.passed.length
        object.warning = validation.checks.warning.length
        object.error = validation.checks.error.length
        object.total = object.valid + object.warning + object.error
        fileMap.set('', object)
      })
      return fileMap
    },
    validations: function () {
      let all = []
      if (!this.tal) {
        return all
      }
      this.tal.validations.filter((v) => {
        return v.status !== 'RUNNING'
      }).map((validation) => {
        this.addCheckToArray(validation.checks.error, 'error', all)
        this.addCheckToArray(validation.checks.warning, 'warning', all)
        this.addCheckToArray(validation.checks.passed, 'valid', all)
      })
      return all
    }
  },
  watch: {
    tal: function (val, oldVal) {
      return val
    }
  }
}
</script>

<style>
</style>
