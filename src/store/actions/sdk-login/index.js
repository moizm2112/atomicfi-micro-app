import {
  SDKLogin,
  trackRequest,
  logEvent,
  offlineAllocation,
  getRequestIdInfo,
  sdkInvocation,
  authToken,
} from "../../../api/commonApi";
import { AUTH_TOKEN } from "../../types/types";

const sdkLoginAction = (value) => async (dispatch) => {
  try {
    const response = await dispatch(SDKLogin(value));
    return Promise.resolve(response);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
const trackRequestAction = (data) => async (dispatch) => {
  try {
    const response = await dispatch(trackRequest(data));
    return Promise.resolve(response);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const logEventAction = (data) => async (dispatch) => {
  try {
    const response = await dispatch(logEvent(data));
    return Promise.resolve(response);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const getRequestIdInfoAction = (data) => async (dispatch) => {
  try {
    const response = await dispatch(getRequestIdInfo(data));
    return Promise.resolve(response);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};


const offlineAllocationAction = (data) => async (dispatch) => {
  try {
    const response = await dispatch(offlineAllocation(data));
    return Promise.resolve(response);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const sdkInovationAllocationAction = (data) => async (dispatch) => {
  try {
    const response = await dispatch(sdkInvocation());
    return Promise.resolve(response);
  } catch (error) {}
};
const sendAuthAction = (value) => async (dispatch) => {
  try {
    const response = await dispatch(authToken(value)).then((res) => {
      if (res.status == 200) {
        const data = {
          authToken: res.data.access_token,
          timeLimit: res.data.expires_in,
        };
        localStorage.setItem('authToken', res.data.access_token);
        localStorage.setItem('refreshToken', res.data.refresh_token);
        dispatch(authTokenState(data));
      }
    });
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};
export const authTokenState = (data) => {
  return {
    type: AUTH_TOKEN,
    payload: data,
  };
};
export {
  sdkLoginAction,
  trackRequestAction,
  logEventAction,
  offlineAllocationAction,
  getRequestIdInfoAction,
  sdkInovationAllocationAction,
  sendAuthAction,
};
