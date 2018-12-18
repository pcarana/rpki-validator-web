export default {
  data: function () {
    return {
      apiPropsMap: {
        SlurmPrefix: {
          object: 'slurm.object.prefix',
          asn: 'common.asn',
          prefix: 'common.prefix',
          maxPrefixLength: 'common.prefixMaxLength',
          comment: 'common.comment'
        },
        SlurmBgpsec: {
          object: 'slurm.object.bgpsec',
          asn: 'common.asn',
          SKI: 'common.ski',
          routerPublicKey: 'common.routerPublicKey',
          comment: 'common.comment'
        }
      }
    }
  }
}
