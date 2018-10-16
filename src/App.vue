<template>
  <b-container fluid class="py-0 px-0">
    <navigation></navigation>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
    <login ref="loginComponent"></login>
  </b-container>
</template>

<script>
import Login from '@/components/common/Login.vue'
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'App',
  components: {
    'login': Login,
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
