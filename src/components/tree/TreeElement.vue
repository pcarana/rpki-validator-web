<template>
  <b-row class="element-row my-1">
    <b-col>
      <b-container fluid class="p-0">
        <b-row class="border rounded p-0 rowClass" :class="{ selected: selected }">
          <b-col :cols="hasChilds ? 10 : 12" class="p-0">
            <div class="text-center align-middle" :class="typeClass">
              <span class="h5">
                .{{ object.type}}
              </span>
            </div>
            <div class="p-2">
              <div class="label">
                {{ $t('repository.validations.location') }}
              </div>
              <div class="value">
                <span v-for="(location, index) in object.locations" :key="index">
                  {{ location }}<span v-if="index < object.locations.length - 1">, </span>
                </span>
              </div>
              <div v-if="object.subjectKeyIdentifier">
                <div class="label" >
                  {{ $t('common.ski') }}
                </div>
                <div class="value">
                  {{ object.subjectKeyIdentifier }}
                </div>
              </div>
              <div v-if="hasChilds">
                <div class="label">
                  {{ $t('repository.general.childCount') }}
                </div>
                <div class="value">
                  {{ object.childCount }}
                </div>
              </div>
              <div v-if="object.type === 'ROA'">
                <div class="label">
                  {{ $t('repository.general.resources') }}
                </div>
                <div class="value">
                  <ul>
                    <li v-for="resource in object.resources" :key="resource.roaId">
                      <div>
                        <b>{{ $t('common.asn') }}:</b> {{ resource.asn }}<br/>
                        <b>{{ $t('common.prefix') }}:</b> {{ resource.prefix }}<br/>
                        <span v-if="resource.maxPrefixLength">
                          <b>{{ $t('common.prefixMaxLength') }}:</b> {{ resource.maxPrefixLength }}<br/>
                        </span>
                        <b-link :to="roaLink(resource.roaId)" target="_blank">
                          {{ $t('general.showDetail') }}
                        </b-link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="object.type === 'GBR'">
                <div class="label">
                  {{ $t('common.vCard') }}:
                </div>
                <div class="value">
                  {{ object.vcard }}
                </div>
              </div>
            </div>
          </b-col>
          <b-col cols="2" class="p-0" v-if="hasChilds">
            <b-button @click="localClick" class="w-100 h-100 h4" variant="dark" :disabled="loading || selected">
              <span v-if="!loading">&gt;</span>
              <img v-else src="@/assets/circular_spinner.gif" alt="..." height="16" width="16" />
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-col>
  </b-row>
</template>

<script>
import config from '@/config'

export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    object: {
      type: Object,
      default: function () {
        return {
          type: null,
          locations: [],
          subjectKeyIdentifier: null
        }
      }
    },
    selected: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function,
      default: (event, index, parentId) => {}
    }
  },
  data () {
    return {}
  },
  methods: {
    localClick (event) {
      event.preventDefault()
      this.onClick(event, this.index, this.object.id)
    },
    roaLink (roaId) {
      return config.api.services.get.roaDetail.replace(':id', roaId)
    }
  },
  computed: {
    typeClass: function () {
      switch (this.object.type) {
        case 'CER':
        case 'CRL':
        case 'ROA':
        case 'MFT':
        case 'GBR':
          return this.object.type.toLowerCase()
        default:
          return 'default'
      }
    },
    hasChilds: function () {
      return this.object.childCount && this.object.childCount > 0
    }
  },
  watch: {
    selected: function (val, oldVal) {
      return val
    },
    loading: function (val, oldVal) {
      return val
    }
  }
}
</script>

<style>
.element-row {
  font-size: 0.9em;
}

.label {
  font-weight: bold;
  padding: 0px;
}

.value {
  padding-left: 4px;
  padding-bottom: 1px;
}

.rowClass {
  background-color: #fef4e6;
  border-color: #fac985;
}

.rowClass:hover, .selected {
  background-color: #fac985;
}

.cer {
  background-color: #fab152;
}

.crl {
  background-color: #fad66b;
}

.roa {
  background-color: #fbbf83;
}

.mft {
  background-color: #fabc6b;
}

.gbr {
  background-color: #e8b37d;
}

.default {
  background-color: #fbc983;
}
</style>
