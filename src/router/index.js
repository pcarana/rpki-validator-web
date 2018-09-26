import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Repositories from '@/components/Repositories'
import Repository from '@/components/Repository'
import Roa from '@/components/Roa'
import Roas from '@/components/Roas'
import SlurmGeneral from '@/components/SlurmGeneral'
import SlurmBgpsec from '@/components/SlurmBgpsec'
import SlurmPrefix from '@/components/SlurmPrefix'
import Validate from '@/components/Validate'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'modules.home',
      component: Home
    },
    {
      path: '/repositories',
      name: 'modules.repositories',
      component: Repositories
    },
    {
      path: '/repositories/:talId',
      name: 'modules.repository',
      component: Repository
    },
    {
      path: '/roa',
      name: 'modules.roas',
      component: Roas
    },
    {
      path: '/roa/:roaId',
      name: 'modules.roa',
      component: Roa
    },
    {
      path: '/slurm/general',
      name: 'modules.slurm.general',
      component: SlurmGeneral
    },
    {
      path: '/slurm/prefix',
      name: 'modules.slurm.prefix',
      component: SlurmPrefix
    },
    {
      path: '/slurm/bgpsec',
      name: 'modules.slurm.bgpsec',
      component: SlurmBgpsec
    },
    {
      path: '/validate',
      name: 'modules.validate',
      component: Validate
    }
  ],
  mode: 'history'
})
