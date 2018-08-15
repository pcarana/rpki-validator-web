<template>
  <div>
    <navigation></navigation>
    <transition name="fade" mode="out-in">
    <router-view/>
    </transition>
  </div>
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
