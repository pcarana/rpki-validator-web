<template>
  <div class="card mb-3">
    <img class="card-img-top" src="@/assets/doge.jpg" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">{{ $t('home.title') }}</h5>
      <p class="card-text">{{ $t('home.welcome') }}</p>
      <p class="card-text">
        <ul>
          <li v-for="route in routes" :key="route.path">
            <a :href="route.path">{{ $t(route.name) }}</a>
          </li>
        </ul>
      </p>
    </div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  data () {
    return {
      routes: router.options.routes
    }
  }
}
</script>

<style>
</style>
