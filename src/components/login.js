import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import paywalletLogo from "../assets/images/paywalletLogo.svg";
import {
  sdkLoginAction,
  trackRequestAction,
  sendAuthAction,
  logEventAction,
  offlineAllocationAction,
  getRequestIdInfoAction,
} from "../store/actions/sdk-login";
import qs from "qs";
import * as Sentry from "@sentry/react";
import { Atomic, Product, Environment } from "@atomicfi/transact-javascript";
import jwt_decode from "jwt-decode";
let decodedRequestId;

const transaction = Sentry.startTransaction({ name: "LoginScreen" });
Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

const Login = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [requestId, setRequestId] = useState("");
  const [providerId, setProviderId] = useState("");

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      const addressUrl = new URL(window.location.href);
      const pathName = addressUrl.pathname.split("/");
      setRequestId(pathName[2]);
      setProviderId(pathName[3]);

      let requestId = pathName[2] ? pathName[2] : '';
      let decoded = jwt_decode(requestId);
      if(decoded.sub){
        decodedRequestId = decoded.sub;
        console.log('SDebug > request Id', decodedRequestId);
      }
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  const startTransact = (response) => {
    const span = transaction.startChild({
      op: 'task',
      description: `Execute Atomic`,
    });
    Atomic.transact({
      config: {
        product: Product.VERIFY,
        publicToken: response.publicToken,
        deeplink: {
          step: "login-company",
          companyId: response.employerID,
          companyName: response.employerName,
        },
        handoff: ["authentication-success"],
      },
      onInteraction: (interaction) => {
        console.log("Interaction event:", interaction.name, interaction.value);

        let MFAopen;
        console.log("Interaction event:", interaction.name, interaction.value);
        if(interaction.name === 'Clicked Continue From Form On Login Page'){
          let object = {
            requestId: decodedRequestId ? decodedRequestId : "244b5c17-6ce3-4a02-861f-e6f91597a400", //decoded requestId
            code: "UI-SDK-LOGIN-SUBMIT", // event code EMSS > employer management search service
            source: "Argyle onUIEvent", // from which source event got triggered
            message: "login - form submitted", // message
            level: "IN_PROGRESS", // progress level possible values (RECEIVED,IN_PROGRESS,SUCCESS,FAILED)
            dateTime: new Date(), // date and time event triggered
            additionalInfoDTO: {
              lender: "LutherSales",
              preferredProvider: "Argyle",
            },
          };
          dispatch(logEventAction(object));
        }
        if(interaction.name === 'Viewed MFA Page'){
          MFAopen = true;
          let object = {
            requestId: decodedRequestId ? decodedRequestId : "244b5c17-6ce3-4a02-861f-e6f91597a400", //decoded requestId
            code: "UI-SDK-MFA-OTP-VERIFY-VIEW", // event code EMSS > employer management search service
            source: "AtomicFi onUIEvent", // from which source event got triggered
            message: "MFA screen - opened", // message
            level: "IN_PROGRESS", // progress level possible values (RECEIVED,IN_PROGRESS,SUCCESS,FAILED)
            dateTime: new Date(), // date and time event triggered
            additionalInfoDTO: {
              lender: "LutherSales",
              preferredProvider: "AtomicFi",
              customerId: interaction.value.customerId ? interaction.value.customerId : ''
            },
          };
          dispatch(logEventAction(object));
        }

        if(interaction.name === 'Viewed Access Unauthorized Page'){
          Sentry.captureMessage("User did not have a valid token");
        } else if(interaction.name === 'Viewed Authentication Failed Page'){
          Sentry.captureMessage("User viewed the page indicating authentication failed");
        } else if(interaction.name === 'Viewed Expired Token Page'){
          Sentry.captureMessage("User has an expired token");
        } else if(interaction.name === 'Viewed Fractional Deposit Error Page'){
          Sentry.captureMessage("User viewed the fractional deposit error page");
        } else {
        }
      },
      onFinish: async (data) => {
        console.log("Finish event:", data.taskId, data.handoff);
        console.log("on finish data", data);
        span.finish();
        transaction.finish();
        var today = new Date();
        var setDate=today.toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: "short"
        })
        var removeString = setDate;
        var newStr = removeString.replace(/,/g, "");
        var getDate = newStr.replace(/AM EDT/g, "EST");
        console.log(getDate);
        const object = {
          provider: "Atomic FI",
          argyleDetail: {},
          atomicFiDetail: {
            identifyTaskId: data.taskId,
            depositTaskId: "",
          },
          json:{
            requestId: "68e0bbe3-a587-4918-9194-13b08c1b6c50",
            code: "ATOMIC-MICRO-APP-PUSH-SUCC",
            source: "AtomicLogin",
            message: "AtomicLogin Push SUCCESS",
            level: "SUCCESS",
            dateTime: getDate,
          },
          trackRequestType: 'loginSdk',
        };

        let getRequestIdInfo = {};
        let offlineAllocationData = {};

        getRequestIdInfo = await dispatch(getRequestIdInfoAction(object));

        let pdSupport =
          getRequestIdInfo.data &&
          getRequestIdInfo.data.pdSupported !== undefined &&
          getRequestIdInfo.data.pdSupported.toString();
        if (
          getRequestIdInfo.data &&
          getRequestIdInfo.data.flowType &&
          getRequestIdInfo.data.flowType.length !== 0 &&
          (getRequestIdInfo.data.flowType.includes("DEPOSIT_ALLOCATION") ||
            getRequestIdInfo.data.flowType.includes("GENERAL"))
        ) {
          if (
            pdSupport === 'false'
          ) {
            offlineAllocationData = await dispatch(
              offlineAllocationAction(object)
            );
          }
          localStorage.setItem("pdSupport", "false");
        } else {
          localStorage.setItem("pdSupport", "true");
        }

        await dispatch(trackRequestAction(object)).then(
          (response) => {
            //if (response.status == 200) {
            history.push({
                pathname: "/loginstatus",
                state: { detail: offlineAllocationData },
            });
            //}
          },
          (err) => {
            console.log(err);
          }
        );
        await clearIframes();
      },
      onClose: (data) => {
        // alert("Close event:", data.reason);
        history.push(`/loginstatusfailed`)
      },
    });
    
  };

  useEffect(() => {
    authTokenRequest();
  }, []);

  const authTokenRequest = async () => {
    const object = qs.stringify({
      client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
      client_secret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET,
      grant_type: process.env.REACT_APP_KEYCLOAK_GRANT_TYPE,
    });
    const span = transaction.startChild({
      op: 'http',
      description: `sendAuthAction`,
    });
    await dispatch(sendAuthAction(object, dispatch)).then((response) => {
      span.finish();
      sdkInvocationLogin();
      console.log(response);
    });
  };
  const sdkInvocationLogin = async () => {
    const span = transaction.startChild({
      op: 'http',
      description: `sdkLoginAction`,
    });
    await dispatch(sdkLoginAction()).then((response) => {
      span.finish();
      startTransact(response.atomicFiDetail);
    });
  };

  function clearIframes() {
    var iframes = document.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
      iframes[i].parentNode.removeChild(iframes[i]);
    }
  }

  return (
    <div className="l-block-outer">
      <div className="l-container-left">
        <div className="l-block">
          <div className="l-text">
            <h1>Welcome to Paywallet</h1>
          </div>
        </div>
      </div>
      <div className="l-container-right l-logo-up">
        <div className="l-up">
          <div className="l-logo text-center">
            <img src={paywalletLogo} alt="" height="100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
