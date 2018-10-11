<template>
  <b-container fluid class="py-0 px-0">
    <navigation></navigation>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </b-container>
</template>

<script>
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'App',
  components: {
    'navigation': Navigation
  },
  data () {
    return {
    }
  }
}
</script>

<style>

</style>
