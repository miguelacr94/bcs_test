import 'dotenv/config';

export const envs = {
  mongo: {
    authUri:
      process.env.MONGO_URI_AUTH || 'mongodb://127.0.0.1:27017/bcs_auth_db',
    customerUri:
      process.env.MONGO_URI_CUSTOMER ||
      'mongodb://127.0.0.1:27017/bcs_customer_db',
    applicationsUri:
      process.env.MONGO_URI_APPLICATIONS ||
      'mongodb://127.0.0.1:27017/bcs_applications_db',
    disbursementsUri:
      process.env.MONGO_URI_DISBURSEMENTS ||
      'mongodb://127.0.0.1:27017/bcs_disbursements_db',
    apiGatewayUri:
      process.env.MONGO_URI_API_GATEWAY ||
      'mongodb://127.0.0.1:27017/bcs_api_gateway_db',
    tracingUri:
      process.env.MONGO_URI_TRACING ||
      'mongodb://127.0.0.1:27017/bcs_tracing_db',
  },

  // Configuración del Message Broker (Redis)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },

  // Configuración de Seguridad
  jwt: {
    secret: process.env.JWT_SECRET || 'mi-clave-secreta-super-dificil-1234',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
};
