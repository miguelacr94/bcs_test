export enum ApplicationPattern {
  CREATE_APPLICATION = 'create_application',
  GET_APPLICATIONS = 'get_applications',
  GET_APPLICATION_BY_ID = 'get_application_by_id',
  GET_ACTIVE_APPLICATION_BY_CLIENT_ID = 'get_active_application_by_client_id',
  UPDATE_APPLICATION = 'update_application',
  SIMULATE_OFFER = 'simulate_offer',
  ACCEPT_OFFER = 'accept_offer',
  ABANDON_APPLICATION = 'abandon_application',
  GET_APPLICATION_EVENTS = 'get_application_events',
  VALIDATE_APPLICATION = 'validate_application',
  FINALIZE_APPLICATION = 'finalize_application',
}

export enum AuthPattern {
  REGISTER_USER = 'register_user',
  LOGIN_USER = 'login_user',
  VALIDATE_TOKEN = 'validate_token',
  UPDATE_USER_PROFILE = 'update_user_profile',
  REFRESH_TOKEN = 'refresh_token',
  LOGOUT = 'logout',
}

export enum CustomerPattern {
  CREATE_CUSTOMER = 'create_customer',
  GET_CUSTOMER_BY_DOCUMENT = 'get_customer_by_document',
}

export enum UserPattern {
  GET_USER_BY_DOCUMENT = 'get_user_by_document',
}

export enum DisbursementPattern {
  CREATE_DISBURSEMENT = 'create_disbursement',
  GET_DISBURSEMENT = 'get_disbursement',
}

export enum TracingPattern {
  CREATE_TRACE = 'create_trace',
}
