const messages = {
  modules: {
    home: 'Inicio',
    repositories: 'Repositorios',
    roa: 'ROA',
    slurm: {
      main: 'SLURM',
      general: 'Completo',
      prefix: 'Prefijos',
      bgpsec: 'BGPsec'
    },
    validate: 'Validación',
    appUpdate: 'Actualización disponible'
  },
  home: {
    title: '¡Bienvenido al cliente Web del Validador de RPKI!',
    welcome: 'Visite cada uno de los módulos para realizar distintas acciones'
  },
  repositories: {
    title: 'Listado de TALs',
    description: 'Estos son los TALs configurados en el validador',
    sync: 'Sincronizar',
    syncing: 'Sincronizando'
  },
  repository: {
    title: 'Detalle de TAL',
    general: {
      title: 'Datos generales',
      name: 'Nombre',
      uris: 'URIs',
      loadedCer: 'Certificado cargado',
      showTree: 'Mostrar árbol de confianza',
      certificationTree: 'Árbol de confianza',
      childCount: 'Número de hijos',
      resources: 'Recursos'
    },
    files: {
      title: 'Resumen de archivos',
      valid: 'Válido',
      warning: 'Advertencia',
      error: 'Error',
      total: 'Total'
    },
    validations: {
      title: 'Validación de archivos',
      fileType: 'Tipo de archivos',
      location: 'Ubicación',
      status: 'Estatus',
      message: 'Mensaje'
    }
  },
  roas: {
    title: 'Listado de ROAs',
    description: 'Estos son los ROAs obtenidos a partir de los TALs configurados'
  },
  roa: {
    title: 'Detalle de ROA',
    general: {
      title: 'General',
      cms: 'CMS'
    },
    eecert: {
      title: 'Certificado EE'
    },
    gbr: {
      title: 'GBRs'
    }
  },
  slurm: {
    prefix: {
      title: 'Prefijos SLURM',
      description: 'Estas son las reglas de prefijos configuradas en el archivo SLURM del validador, ya sea como Filtros o Aserciones'
    },
    bgpsec: {
      title: 'Reglas BGPsec SLURM',
      description: 'Estas son las reglas de BGPsec configuradas en el archivo SLURM del validador, ya sea como Filtros o Aserciones'
    },
    filter: {
      title: 'Filtro',
      addNew: 'Agregar nuevo filtro'
    },
    assertion: {
      title: 'Aserción',
      addNew: 'Agregar nueva aserción'
    },
    object: {
      bgpsec: 'Objeto BGPsec',
      prefix: 'Objeto Prefijo'
    },
    general: {
      title: 'SLURM configurado',
      description: 'Esta es una vista previa del archivo SLURM configurado en el validador'
    }
  },
  validate: {
    title: 'Validación',
    description: 'Simule el resultado de la validación de un anuncio de ruta, siguiendo las reglas del RFC 6483, el resultado será el Estatus de Validez de Ruta',
    request: 'Validar',
    status: 'Estatus',
    validityState: 'Estatus de Validez de Ruta',
    roaMatch: 'ROA encontrado',
    roaClosestMatch: 'ROA más cercano encontrado',
    state: {
      valid: 'Válido',
      invalid: 'Inválido',
      unknown: 'Desconocido'
    },
    validityMatrix: {
      nonIntersecting: 'Sin intersección',
      coveringAggregate: 'Cubierto por el conjunto',
      matchRoa: 'Prefijo de ROA encontrado',
      moreSpecific: 'Más específico que el ROA',
      matchAs: 'Concuerda',
      nonMatchAs: 'No concuerda'
    }
  },
  common: {
    asn: 'ASN',
    prefix: 'Prefijo',
    prefixLength: 'Longitud de prefijo',
    prefixMaxLength: 'Longitud máxima del prefijo',
    prefixFamily: 'Familia de prefijo',
    action: 'Acción',
    ski: 'SKI',
    publicKey: 'Llave pública',
    routerPublicKey: 'Llave pública de Router',
    vCard: 'vCard',
    hexValue: 'Valor hexadecimal',
    derFormat: 'Formato DER codificado en base64',
    comment: 'Comentario',
    add: 'Añadir',
    cancel: 'Cancelar',
    createSuccess: '¡Objeto creado exitosamente!',
    delete: 'Eliminar',
    confirm: 'Confirmación',
    confirmDelete: '¿Desea eliminar el siguiente objeto?',
    deleteSuccess: '¡Objeto eliminado exitosamente!',
    syncSuccess: '¡Sincronización solicitada exitosamente!',
    syncError: 'La sincronización se solicitó, pero hubo un error ejecutándola en el servidor; intente nuevamente.',
    loading: 'Cargando...',
    element: 'Elemento #{n}',
    noElements: 'Sin elementos'
  },
  filter: {
    placeholder: 'Filtro...',
    clean: 'Limpiar',
    all: 'Todos'
  },
  general: {
    return: 'Regresar',
    displaying: 'Mostrando del {from} al {to} de {total}',
    maxResults: 'Máximo de filas',
    showDetail: 'Ver detalle'
  },
  login: {
    username: 'Usuario',
    password: 'Contraseña'
  },
  errors: {
    noDataFound: 'No se encontraron datos',
    asnOrPrefixRequired: 'Se requiere el ASN o el prefijo',
    asnOrSkiRequired: 'Se requiere el ASN o el SKI',
    checkErrors: 'Para continuar, revise los errores indicados en el formulario',
    asnInvalid: 'ASN inválido',
    prefixInvalid: 'Debe ser un bloque IP válido',
    prefixLengthInvalid: 'Debe tener un valor entre {min} y {max}',
    prefixMaxLengthGt: 'Deber ser mayor o igual que la longitud del prefijo',
    skiInvalid: 'Debe ser un valor hexadecimal válido de 40 caracteres',
    routerPublicKeyInvalid: 'Debe ser una llave pública válida en formato DER y codificada en base64',
    commentInvalid: 'Debe tener entre {min} y {max} caracteres',
    usernameRequired: 'Usuario requerido',
    passwordRequired: 'Contraseña requerida',
    invalidCredentials: 'Usuario y/o contraseña inválido(s)',
    tryLogin: 'intentar autenticación',
    tryAgain: 'intentar nuevamente',
    http: {
      badRequest: {
        title: 'Petición incorrecta al servidor',
        message: 'La petición realizada al servidor no fue válida'
      },
      unauthorized: {
        title: 'No autorizado',
        message: 'El servicio solicitado requiere autenticación'
      },
      notFound: {
        title: 'Objeto no encontrado',
        message: 'El servidor no encontró el objeto o servicio solicitado'
      },
      methodNotAllowed: {
        title: 'No está permitido',
        message: 'La operación no está permitida en el servidor'
      },
      conflict: {
        title: 'Conflicto',
        message: 'Hubo un conflicto en el servidor al realizar la acción'
      },
      internalServer: {
        title: 'Error en el servidor',
        message: 'Ocurrió un error en el servidor'
      },
      default: {
        title: 'Error de comunicación',
        message: 'Ocurrió un error al comunicarse con el servidor'
      }
    },
    request: {
      incomplete: {
        title: 'Error local',
        message: 'Ocurrió un error antes de enviar la petición al servidor'
      }
    },
    serverMessage: 'El servidor envió el mensaje: \'{serverMessage}\''
  },
  language: 'Lenguaje'
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
