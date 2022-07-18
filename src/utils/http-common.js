import axios from "axios";
import { BASE_URL } from "./ApiUrl";
import qs from "qs";
import Swal from 'sweetalert2';

export const axiosApi = axios.create({
  baseURL: BASE_URL.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: function (status) {
    handleResponse(status);
    return status >= 200 && status < 300; // default
  },
});

export const axiosTokenApi = axios.create({
  baseURL:  BASE_URL.AUTH_BASE_URL,   
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  validateStatus: function (status) {
      handleResponse(status)
      return status >= 200 && status < 300; // default
  },
});

function handleResponse(response) {
  if (response >= 400) {
    if (response === 401) {
      // auto logout if 401 response returned from api
    }
  } else if (response === 301) {
    // console.log(response);
  }
  return response;
}

axiosApi.interceptors.request.use(
  (config) => {
    const token = `Bearer ${localStorage.getItem('authToken')}`;
    const locationUrl = new URL(window.location.href);
    const pathName = locationUrl.pathname.split("/");
    if (token) {
      console.log('SDebug > config', config);
      // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      config.headers["Authorization"] = token; // for Node.js Express back-end
      config.headers["x-request-id"] = localStorage.getItem('x-request-id') ? localStorage.getItem('x-request-id') : `${pathName[2]}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    console.log('SDebug > ', err.response.status)
    // if (originalConfig.url !== "/auth/signin" && err.response) {
    //   // Access Token was expired
      if (err.response.status === 401) {
        try {
          const object = qs.stringify({
            client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
            grant_type: process.env.REACT_APP_KEYCLOAK_GRANT_TYPE_REFRESH,
            refresh_token: localStorage.getItem('refreshToken'),
            client_secret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET,
          });
          const rs = await axiosTokenApi.post("/auth/realms/paywallet/protocol/openid-connect/token", object);
          const data = {
            authToken: rs.data.access_token,
            timeLimit: rs.data.expires_in,
            refreshToken: rs.data.refresh_token,
          };
          localStorage.setItem('authToken', rs.data.access_token);
          localStorage.setItem('refreshToken', rs.data.refresh_token);
          return axiosApi(originalConfig);
          // const { accessToken } = rs.data;
          // console.log('SDebug > ', rs.data)
          // TokenService.updateLocalAccessToken(accessToken);
        } catch (_error) {
          Swal.fire({
            title: 'OOPs !',
            text: "Your session has expired do you want to continue !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then( async (result) => {
            const object = qs.stringify({
              client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
              client_secret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET,
              grant_type: process.env.REACT_APP_KEYCLOAK_GRANT_TYPE,
            });
            const rs = await axiosTokenApi.post("/auth/realms/paywallet/protocol/openid-connect/token", object);
           
            localStorage.setItem('authToken', rs.data.access_token);
            localStorage.setItem('refreshToken', rs.data.refresh_token);
            return axiosApi(originalConfig);
          })
          //return Promise.reject(_error);
          // localStorage.setItem("expireToken",err.response.data)
          // window.location.reload()
        }
      }
    // }
    return Promise.reject(err);
  }
);