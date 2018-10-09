/* eslint-disable */
export default {
    api: {
        url: 'http://localhost:9090/rpki-validator-api-0.0.1-SNAPSHOT',
        services: {
            get: {
                talList: '/tal',
                talDetail: '/tal/:id',
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
