<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ $t('home.title') }}</h5>
      <p class="card-text">{{ $t('home.welcome') }}</p>
      <p class="card-text">
        <ul>
          <li v-for="route in routes" :key="route.to">
            <b-link :to="route.to">{{ $t(route.name) }}</b-link>
          </li>
        </ul>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routes: [
        { to: '/repositories', name: 'modules.repositories' },
        { to: '/roa', name: 'modules.roa' },
        { to: '/slurm/general', name: 'modules.slurm.main' },
        { to: '/validate', name: 'modules.validate' }
      ]
    }
  }
}
</script>

<style>
</style>
