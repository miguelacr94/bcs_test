export const SharedMessages = {
  Auth: {
    TOKEN_NOT_PROVIDED: 'Token no provisto.',
    INVALID_TOKEN_FORMAT: 'Formato de token inválido. Debe ser Bearer <token>.',
    INVALID_OR_EXPIRED_TOKEN: 'Token inválido o expirado.',
    AUTH_ERROR: 'Error de autenticación.',
  },
  Customer: {
    ALREADY_REGISTERED:
      'El cliente ya se encuentra registrado con este documento.',
    NOT_FOUND: 'Cliente no encontrado.',
  },
  Application: {
    RESTRICTION_ERROR: (dateStr: string) =>
      `Tiene una solicitud finalizada recientemente. Podrá iniciar un nuevo proceso a partir del ${dateStr}.`,
    AUDIT_CREATED: (channel: string) =>
      `Solicitud creada por el cliente desde el canal: ${channel}`,
    AUDIT_SPECIAL_OFFERT: `Solicitud Web de alto monto requiere validación analista`,
    NOT_FOUND: 'Solicitud no encontrada.',
  },
  UserCore: {
    SEARCH_ERROR: (doc: string) =>
      `Error al buscar usuario con documento ${doc}`,
  },
};
