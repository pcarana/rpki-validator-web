import Home from '@/components/Home'
import Repositories from '@/components/Repositories'
import Repository from '@/components/Repository'
import Roa from '@/components/Roa'
import Roas from '@/components/Roas'
import SlurmGeneral from '@/components/SlurmGeneral'
import SlurmBgpsec from '@/components/SlurmBgpsec'
import SlurmPrefix from '@/components/SlurmPrefix'
import Validate from '@/components/Validate'
import KeepAlive from '@/components/common/KeepAlive'

export default {
  routes: [
    {
      path: '/',
      name: 'modules.home',
      component: Home
    },
    {
      path: '/repositories',
      component: KeepAlive,
      children: [
        {
          path: '',
          name: 'modules.repositories',
          component: Repositories
        },
        {
          path: ':id',
          name: 'modules.repository',
          component: Repository,
          props: true
        }
      ]
    },
    {
      path: '/roa',
      component: KeepAlive,
      children: [
        {
          path: '',
          name: 'modules.roas',
          component: Roas
        },
        {
          path: ':id',
          name: 'modules.roa',
          component: Roa,
          props: true
        }
      ]
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
}
