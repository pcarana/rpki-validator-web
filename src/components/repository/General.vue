<template>
  <b-container fluid class="d-inline-block general p-4">
    <b-row>
      <b-col>
        <b>{{ $t('repository.general.name') }}</b>
        <p class="pl-2 mb-1">{{ tal.name }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b>{{ $t('repository.general.uris') }}</b>
        <p class="pl-2 mb-1" v-for="uri in tal.uris" :key="uri.location">
          {{ uri.location}}
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button :pressed.sync="pkTogglePressed"
                  size="sm"
                  variant="link"
                  class="toggleLink pl-0">
          <img v-if="!pkTogglePressed" src="@/assets/plus_icon.svg" width="8" height="8" alt="+" />
          <img v-else src="@/assets/less_icon.svg" width="8" height="8" alt="-" />
          {{ $t('common.publicKey') }}
        </b-button>
        <b-collapse id="pkToggle" v-model="pkTogglePressed">
          <p class="pl-2 mb-1">{{ tal.publicKey }}</p>
        </b-collapse>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button :pressed.sync="cerTogglePressed"
                  size="sm"
                  variant="link"
                  class="toggleLink pl-0">
          <img v-if="!cerTogglePressed" src="@/assets/plus_icon.svg" width="8" height="8" alt="+" />
          <img v-else src="@/assets/less_icon.svg" width="8" height="8" alt="-" />
          {{ $t('repository.general.loadedCer') }}
        </b-button>
        <b-collapse id="cerToggle" v-model="cerTogglePressed">
          <json-object :object="tal.loadedCer"></json-object>
        </b-collapse>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    tal: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pkTogglePressed: false,
      cerTogglePressed: false
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
.general {
  word-wrap: break-word
}
.toggleLink{
  color: black;
  font-weight: bold;
  font-size: 1em;
}
</style>
