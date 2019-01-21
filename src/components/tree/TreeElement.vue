<template>
  <b-row class="element-row my-1">
    <b-col>
      <b-container fluid class="p-0">
        <b-row class="border rounded p-0 rowClass" :class="{ selected: selected }">
          <b-col cols="1" class="p-0 m-0 h6" :class="typeClass">
            <div class="vertical-text">
              {{ object.type}}
            </div>
          </b-col>
          <b-col :cols="hasChilds ? 10 : 11" class="p-0">
            <div class="p-2">
              <div>
                {{ fileName }} <span class="childs" v-if="hasChilds">({{ $t('common.nChilds', {n: object.childCount}) }})</span>
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
              <div>
                <b-btn :id="'detailBtn.' + parentIndex + '.' + index" variant="link" size="sm" class="p-0 detailLink">
                  {{ $t('general.showDetail') }}
                </b-btn>
              </div>
            </div>
          </b-col>
          <b-col cols="1" class="p-0" v-if="hasChilds">
            <b-button @click="localClick" class="w-100 h-100 h4" variant="dark" :disabled="loading || selected">
              <span v-if="!loading">&gt;</span>
              <img v-else src="@/assets/circular_spinner.gif" alt="..." height="16" width="16" />
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-col>
    <b-tooltip :target="'detailBtn.' + parentIndex + '.' + index"
                placement="auto"
                boundary="window">
      <div class="detailLabel">
        {{ $t('repository.validations.location') }}
      </div>
      <div class="detailValue">
        <span v-for="(location, index) in object.locations" :key="index">
          {{ location }}<span v-if="index < object.locations.length - 1">, </span>
        </span>
      </div>
      <div v-if="object.subjectKeyIdentifier">
        <div class="detailLabel" >
          {{ $t('common.ski') }}
        </div>
        <div class="detailValue">
          {{ object.subjectKeyIdentifier }}
        </div>
      </div>
      <div v-if="object.type === 'ROA'">
        <div class="detailLabel">
          {{ $t('repository.general.resources') }}
        </div>
        <div class="detailValue">
          <ul>
            <li v-for="resource in object.resources" :key="resource.roaId">
              <div>
                <b>{{ $t('common.asn') }}:</b> {{ resource.asn }}<br/>
                <b>{{ $t('common.prefix') }}:</b> {{ resource.prefix }}<br/>
                <span v-if="resource.maxPrefixLength">
                  <b>{{ $t('common.prefixMaxLength') }}:</b> {{ resource.maxPrefixLength }}<br/>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="object.type === 'GBR'">
        <div class="detailLabel">
          {{ $t('common.vCard') }}:
        </div>
        <div class="detailValue">
          {{ object.vcard }}
        </div>
      </div>
    </b-tooltip>
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
    parentIndex: {
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
    },
    fileName: function () {
      if (!this.object.locations || this.object.locations.length < 1) {
        return 'N/A'
      }
      let arr = this.object.locations[0].split('/')
      return arr[arr.length - 1]
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
.element-row, .detail-link {
  font-size: 0.8em;
}

.childs {
  font-style: italic;
  font-size: 0.8em;
}

.label {
  font-weight: bold;
}

.value {
  margin-left: 1rem;
}

.value ul {
  list-style-type: none;
  margin: 0;
  padding-left: 0.5rem;
}

.value ul li {
  list-style: square;
}

.detailLabel {
  font-weight: bold;
  padding: 0px;
  text-align: left;
}

.detailValue {
  padding-left: 4px;
  padding-bottom: 1px;
  text-align: left;
}

.tooltip-inner {
  max-width: 400px;
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

.vertical-text {
  /* FF3.5+ */
  -moz-transform: rotate(-90.0deg);
  -moz-transform-origin: left top 0;
  /* Opera 10.5 */
  -o-transform: rotate(-90.0deg);
  -o-transform-origin: left top 0;
  /* Saf3.1+, Chrome */
  -webkit-transform: rotate(-90.0deg);
  -webkit-transform-origin: left top 0;
  /* IE6,IE7 */
  filter: progid: DXImageTransform.Microsoft.BasicImage(rotation=0.083);
  /* IE8 */
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=0.083)";
  /* Standard */
  transform: rotate(-90.0deg);
  transform-origin: left top 0;
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
