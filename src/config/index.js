/* eslint-disable */
const repository = 'pcarana/rpki-validator-web'
const data = {
    appVersion: 'v1.0.0',
    githubLatest: 'https://api.github.com/repos/' + repository + '/releases/latest',
    githubRepo: 'https://github.com/' + repository + '/releases/latest',
    checkAppUpdatesMs: 600000,
    supportedLangs: [
        { id: 'en', label: 'EN' },
        { id: 'es', label: 'ES' }
    ],
    locale: 'en',
    fallbackLocale: 'en',
    api: {
        url: 'http://localhost/rpki-validator-api',
        services: {
            get: {
                talList: '/tal',
                talDetail: '/tal/:id',
                treeRoot: '/tree/root/:id',
                treeChild: '/tree/child/:id',
                roaList: '/roa',
                roaDetail: '/roa/:id',
                slurmGeneral: '/slurm',
                slurmPrefixList: '/slurm/prefix',
                slurmPrefixDetail: '/slurm/prefix/:id',
                slurmPrefixFilterList: '/slurm/prefix/filter',
                slurmPrefixAssertionList: '/slurm/prefix/assertion',
                slurmBgpsecList: '/slurm/bgpsec',
                slurmBgpsecDetail: '/slurm/bgpsec/:id',
                slurmBgpsecFilterList: '/slurm/bgpsec/filter',
                slurmBgpsecAssertionList: '/slurm/bgpsec/assertion',
                validate: '/validate/:asn/:prefix/:prefix-length'
            },
            post: {
                talSync: '/tal/sync/:id',
                slurmPrefixFilter: '/slurm/prefix/filter',
                slurmPrefixAssertion: '/slurm/prefix/assertion',
                slurmBgpsecFilter: '/slurm/bgpsec/filter',
                slurmBgpsecAssertion: '/slurm/bgpsec/assertion',
            },
            delete: {
                slurmPrefix: '/slurm/prefix/:id',
                slurmBgpsec: '/slurm/bgpsec/:id'
            }
        }
    }
}

export default data