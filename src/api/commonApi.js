import LoginService from "../utils/services/loginService";

const SDKLogin = () => async (dispatch) => {
  try {
    const res = await LoginService.SDKLoginApi(null, true);

    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

const trackRequest = (data) => async (dispatch) => {
  try {
    const res = await LoginService.trackRequestApi(data, true);
    return Promise.resolve(res);
  } catch (e) {
    return Promise.reject(e);
  }
};
const logEvent = (data) => async (dispatch) => {
  try {
    const res = await LoginService.logEventApi(data, true);
    return Promise.resolve(res);
  } catch (e) {
    return Promise.reject(e);
  }
};
const offlineAllocation = (data) => async (dispatch) => {
  try {
    const res = await LoginService.offlineAllocationApi(data, true);
    return Promise.resolve(res);
  } catch (e) {
    return Promise.reject(e);
  }
};

const getRequestIdInfo = (data) => async (dispatch) => {
  try {
    const res = await LoginService.getRequestIdInfoApi(data, true);
    return Promise.resolve(res);
  } catch (e) {
    return Promise.reject(e);
  }
};


const sdkInvocation = () => async (dispatch) => {
  try {
    const response = await LoginService.sdkInvocationApi(null, true);
    return Promise.resolve(response);
  } catch (error) {}
};

const authToken = (data) => async (dispatch) => {
  try {
    let result = await LoginService.authPost(data);
    return result;
  } catch (err) {
    return {};
  }
};
export { SDKLogin, trackRequest, sdkInvocation, authToken, logEvent, offlineAllocation, getRequestIdInfo };
