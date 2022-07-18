import axios from "axios";
import * as Sentry from "@sentry/react";
import { API_URL, BASE_URL } from "../ApiUrl";
import { axiosApi } from "../http-common";
import store from "../../store/store";
import jwt_decode from "jwt-decode";

const url = new URL(window.location.href);
const pathName = url.pathname.split("/");
const authToken = localStorage.getItem("authToken");
console.log("authToken", authToken);

const SDKLoginApi = async (data = null, sendToken = false) => {
  return axiosApi
    .post(`${API_URL.SDK_LOGIN}`, null, {
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.authToken}`,
        "x-request-id": localStorage.getItem("x-request-id") ? localStorage.getItem("x-request-id") : `${pathName[2]}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Sentry.captureException(error);
      return error;
    });
};
const trackRequestApi = async (data, sendToken = false) => {
  return axiosApi
    .post(`${API_URL.PAY_ALLOCATIOH}`, data, {
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.authToken}`,
        "x-request-id": localStorage.getItem("x-request-id") ? localStorage.getItem("x-request-id") : `${pathName[2]}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Sentry.captureException(error);
      return error;
    });
};

const logEventApi = async (data, sendToken = false) => {
  return axiosApi
    .post(`${API_URL.LOG_EVENT}`, data, {
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.authToken}`,
        "x-request-id": localStorage.getItem("x-request-id") ? localStorage.getItem("x-request-id") : `${pathName[2]}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Sentry.captureException(error);
      return error;
    });
};

const offlineAllocationApi = async (data, sendToken = false) => {
  return axiosApi
    .post(`${API_URL.OFFLINE_ALLOCATION}`, data, {
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.authToken}`,
        "x-request-id": localStorage.getItem("x-request-id") ? localStorage.getItem("x-request-id") : `${pathName[2]}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Sentry.captureException(error);
      return error;
    });
};

const getRequestIdInfoApi = async (data, sendToken = false) => {
  return axiosApi
    .get(`${API_URL.GET_REQUEST_DATA}`, {
      headers: {
        Authorization: `Bearer ${store.getState().authReducer.authToken}`,
        "x-request-id": localStorage.getItem("x-request-id") ? localStorage.getItem("x-request-id") : `${pathName[2]}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Sentry.captureException(error);
      return error;
    });
};

const sdkInvocationApi = async (data = null, sendToken = false) => {
return axiosApi
.get(`${API_URL.SDK_ALLOCATION}`, {
  headers: {
    Authorization: `Bearer ${store.getState().authReducer.authToken}`,
    "x-request-id": localStorage.getItem("x-request-id") ? localStorage.getItem("x-request-id") : `${pathName[2]}`,
  },
})
.then((response) => {
  return response;
})
.catch((error) => {
  Sentry.captureException(error);
  return error;
});

};
const authPost = (data) => {
  let url = `${BASE_URL.AUTH_BASE_URL}${API_URL.TOKEN}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return axios({ method: "POST", url: url, headers: headers, data: data })
  .then((res) => {
    Sentry.configureScope(function(scope) {
      let requestId = `${pathName[2]}`;
      localStorage.setItem('x-request-id', pathName[2]);
      let decoded = jwt_decode(requestId);
      if(decoded.sub){
        scope.setTag("transaction_id", decoded.sub);
      }
    });
    return res;
  })
  .catch((error) => {
    Sentry.captureException(error);
    return error.response;
  });
  // return axiosApi
  //   .post(
  //     `${BASE_URL.AUTH_BASE_URL}${API_URL.TOKEN}`,
  //     data,
  //     {
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     },
  //     {}
  //   )
  //   .then((response) => {
  //     return response;
  //   })
  //   .catch((error) => {
  //     return error;
  //   });
};
const LoginService = {
  SDKLoginApi,
  trackRequestApi,
  logEventApi,
  offlineAllocationApi,
  getRequestIdInfoApi,
  sdkInvocationApi,
  authPost,
};

export default LoginService;
