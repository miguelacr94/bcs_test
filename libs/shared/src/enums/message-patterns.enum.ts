export enum ApplicationPattern {
  CREATE_APPLICATION = 'create_application',
  GET_APPLICATIONS = 'get_applications',
  GET_APPLICATION_BY_ID = 'get_application_by_id',
  UPDATE_APPLICATION = 'update_application',
  SIMULATE_OFFER = 'simulate_offer',
  FINALIZE_APPLICATION = 'finalize_application',
  ABANDON_APPLICATION = 'abandon_application',
  GET_APPLICATION_EVENTS = 'get_application_events',
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
