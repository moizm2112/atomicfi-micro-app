export const API_URL = {
  SDK_LOGIN: "sdk-invocation/login",
  PAY_ALLOCATIOH: "payallocation/track-request",
  LOG_EVENT: "logEvent",
  OFFLINE_ALLOCATION: "allocation/offline-allocation",
  GET_REQUEST_DATA: 'request',
  SDK_ALLOCATION: "sdk-invocation/allocation",
  TOKEN: "auth/realms/paywallet/protocol/openid-connect/token",
};

export const BASE_URL = {
  BASE_URL: process.env.REACT_APP_API_URL,
  AUTH_BASE_URL: process.env.REACT_APP_KEYCLOAK_AUTH_URL,
};
