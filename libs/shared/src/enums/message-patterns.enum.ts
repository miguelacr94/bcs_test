export enum AuthPattern {
  REGISTER_USER = 'register_user',
  LOGIN_USER = 'login_user',
  VALIDATE_TOKEN = 'validate_token',
  REFRESH_TOKEN = 'refresh_token',
  LOGOUT = 'logout',
  UPDATE_USER_PROFILE = 'update_user_profile',
}

export enum ProductPattern {
  CREATE_PRODUCT = 'create_product',
  GET_ALL_PRODUCTS = 'get_all_products',
  GET_PRODUCT_BY_ID = 'get_product_by_id',
  UPDATE_PRODUCT = 'update_product',
  DELETE_PRODUCT = 'delete_product',
  REDUCE_STOCK = 'reduce_stock',
  GET_PRODUCTS_BY_CATEGORY = 'get_products_by_category',
  ACTIVATE_PRODUCT = 'activate_product',
}

export enum OrderPattern {
  CREATE_ORDER = 'create_order',
  GET_USER_ORDERS = 'get_user_orders',
}
