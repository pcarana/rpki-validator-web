const messages = {
  modules: {
    home: 'Home',
    repositories: 'Repositories',
    roa: 'ROA',
    slurm: {
      main: 'SLURM',
      general: 'Complete',
      prefix: 'Prefix',
      bgpsec: 'BGPsec'
    },
    validate: 'Validate',
    appUpdate: 'Update available'
  },
  home: {
    title: 'Welcome to the RPKI Validator Web client!',
    welcome: 'Visit the modules to perform distinct actions'
  },
  repositories: {
    title: 'TAL List',
    description: 'These are the TALs configured at the validator',
    sync: 'Synchronize',
    syncing: 'Synchronizing'
  },
  repository: {
    title: 'TAL detail',
    general: {
      title: 'General data',
      name: 'Name',
      uris: 'URIs',
      loadedCer: 'Loaded certificate',
      showTree: 'Show certification tree',
      certificationTree: 'Certification tree',
      childCount: 'Child count',
      resources: 'Resources'
    },
    files: {
      title: 'Files summary',
      valid: 'Valid',
      warning: 'Warning',
      error: 'Error',
      total: 'Total'
    },
    validations: {
      title: 'Files validation',
      fileType: 'File type',
      location: 'Location',
      status: 'Status',
      message: 'Message'
    }
  },
  roas: {
    title: 'ROA List',
    description: 'These are the ROAs loaded from the configured TALs'
  },
  roa: {
    title: 'ROA detail',
    general: {
      title: 'General',
      cms: 'CMS'
    },
    eecert: {
      title: 'EE certificate'
    },
    gbr: {
      title: 'GBRs'
    }
  },
  slurm: {
    prefix: {
      title: 'SLURM Prefix',
      description: 'These are the prefixes configured at the SLURM file, either as Filters or Assertions'
    },
    bgpsec: {
      title: 'SLURM BGPsec',
      description: 'These are the BGPsec rules configured at the SLURM file, either as Filters or Assertions'
    },
    filter: {
      title: 'Filter',
      addNew: 'Add new filter'
    },
    assertion: {
      title: 'Assertion',
      addNew: 'Add new assertion'
    },
    object: {
      bgpsec: 'BGPsec object',
      prefix: 'Prefix object'
    },
    general: {
      title: 'SLURM loaded',
      description: 'This is a preview of the SLURM loaded at the validator'
    }
  },
  validate: {
    title: 'Validate',
    description: 'Simulate the validation result of a route announcement according to the rules of RFC 6483, the result will be the Route\'s Validity State',
    request: 'Validate',
    status: 'Status',
    validityState: 'Route\'s Validity State',
    roaMatch: 'ROA matched',
    roaClosestMatch: 'Closest ROA matched',
    state: {
      valid: 'Valid',
      invalid: 'Invalid',
      unknown: 'Unknown'
    },
    validityMatrix: {
      nonIntersecting: 'Non intersecting',
      coveringAggregate: 'Covering aggregate',
      matchRoa: 'Match ROA prefix',
      moreSpecific: 'More specific than ROA',
      matchAs: 'Matching',
      nonMatchAs: 'Non matching'
    }
  },
  common: {
    asn: 'ASN',
    prefix: 'Prefix',
    prefixLength: 'Prefix length',
    prefixMaxLength: 'Prefix max length',
    prefixFamily: 'Prefix family',
    action: 'Action',
    ski: 'SKI',
    publicKey: 'Public key',
    routerPublicKey: 'Router public key',
    vCard: 'vCard',
    hexValue: 'Hexadecimal value',
    derFormat: 'DER format base64 encoded',
    comment: 'Comment',
    add: 'Add',
    cancel: 'Cancel',
    createSuccess: 'Object successfully created!',
    delete: 'Delete',
    confirm: 'Confirmation',
    confirmDelete: 'Do you wish to delete the following object?',
    deleteSuccess: 'Object successfully deleted!',
    syncSuccess: 'Synchronization successfully requested!',
    syncError: 'The synchronization was requested, but there was an error executing it at the server; try again.',
    loading: 'Loading...',
    element: 'Element #{n}'
  },
  filter: {
    placeholder: 'Filter...',
    clean: 'Clean',
    all: 'All'
  },
  general: {
    return: 'Return',
    displaying: 'Displaying from {from} to {to} of {total}',
    maxResults: 'Max rows',
    showDetail: 'Show detail'
  },
  login: {
    username: 'Username',
    password: 'Password'
  },
  errors: {
    noDataFound: 'No data found',
    asnOrPrefixRequired: 'An ASN or a prefix is required',
    asnOrSkiRequired: 'An ASN or a SKI is required',
    checkErrors: 'To continue, check the errors indicated at the form',
    asnInvalid: 'Invalid ASN',
    prefixInvalid: 'Must be a valid IP block',
    prefixLengthInvalid: 'Must be between {min} and {max}',
    prefixMaxLengthGt: 'Must be greater than or equal to the prefix length',
    skiInvalid: 'Must be a valid hexadecimal value of 40 characters',
    routerPublicKeyInvalid: 'Must be a valid public key in DER format base64 encoded',
    commentInvalid: 'Must have between {min} and {max} characters',
    usernameRequired: 'Username required',
    passwordRequired: 'Password required',
    invalidCredentials: 'Invalid username/password',
    tryLogin: 'try to login',
    tryAgain: 'try again',
    http: {
      badRequest: {
        title: 'Bad request to the server',
        message: 'The request made to the server isn\'t valid'
      },
      unauthorized: {
        title: 'Unauthorized',
        message: 'The requested service needs authentication'
      },
      notFound: {
        title: 'Object not found',
        message: 'The server didn\'t found the searched object or service'
      },
      methodNotAllowed: {
        title: 'Not allowed',
        message: 'The operation isn\'t allowed at the server'
      },
      conflict: {
        title: 'Conflict',
        message: 'There was a conflict performing the action'
      },
      internalServer: {
        title: 'Server error',
        message: 'There was an error at the server'
      },
      default: {
        title: 'Communication error',
        message: 'There was an error communicating with the server'
      }
    },
    request: {
      incomplete: {
        title: 'Local error',
        message: 'There was a local error before sending the request to the server'
      }
    },
    serverMessage: 'The server sent the message: \'{serverMessage}\''
  },
  language: 'Language'
}

const dateTimeFormats = {
  short: {
    year: 'numeric', month: 'short', day: 'numeric'
  }
}

export default {
  messages: messages,
  dateTimeFormats: dateTimeFormats
}
