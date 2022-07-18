import React, { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import paywalletLogo from "../assets/images/paywalletLogo.svg";
import {
  sdkInovationAllocationAction,
  trackRequestAction,
  offlineAllocationAction,
  sendAuthAction,
} from "../store/actions/sdk-login";
import qs from "qs";
import * as Sentry from "@sentry/react";
import { Atomic, Product, Environment } from "@atomicfi/transact-javascript";


const transaction = Sentry.startTransaction({ name: "AllocationScreen" });
Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

const Allocation = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showerrorCode, setshowerrorCode]=React.useState()

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
      sdkInvocationAllocation();
    });
  };

  const startTransact = (res) => {
    const span = transaction.startChild({
      op: 'task',
      description: `Execute Atomic`,
    });

    Atomic.transact({
      config: {
        product: Product.DEPOSIT,
        publicToken: res.publicToken,
        deeplink: {
          step: "login-company",
          companyId: res.employerID,
        },
        handoff: ["authentication-success"],
        distribution: {
          type: res.type,
          amount: parseFloat(res.amount),
          action: res.action.toLowerCase(),
        },
        linkedAccount: res.linkedAccount,
      },
      onInteraction: (interaction) => {
        console.log("Interaction event all data:", interaction);
        console.log("Interaction event:", interaction.name, interaction.value);
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
        console.log("On finish all data", data);
        console.log("Finish event:", data.taskId, data.handoff);
        const object = {
          provider: "Atomic FI",
          argyleDetail: {},
          atomicFiDetail: {
            depositTaskId: data.taskId,
            identifyTaskId: "",
          },
          trackRequestType: 'allocationSdk',
        };
        await dispatch(trackRequestAction(object));
        await dispatch(offlineAllocationAction(object));
        await clearIframes();
        window.parent.postMessage({ message: "getData", value: {"allocationStatus": "Pay allocation successfully submitted"} }, "*");
          history.push(`/allocationstatus`);
        await clearIframes();
      },
      onClose: (data) => {
        console.log("Close event data all:", data);
        console.log("Close event:", data.reason);
        window.parent.postMessage({ message: "getData", value: {"allocationStatus": "Pay allocation Failed."} }, "*");
        history.push(`/allocationstatusfailed`);
      },
    });
    span.finish();
    transaction.finish();
  };

  function clearIframes() {
    var iframes = document.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
      iframes[i].parentNode.removeChild(iframes[i]);
    }
  }
  const sdkInvocationAllocation = async () => {
    await dispatch(sdkInovationAllocationAction()).then((res) => { 
      if (res.status === 200) {
        console.log("response", res);
        startTransact(res.data.atomicFiDetail);
      }
      if(res.response && res.response.data){
        setshowerrorCode(res.response.data.errorCode)
      }
    });
  };

  return (
    <div className="l-block-outer">
      <div className="l-container-left">
        <div className="l-block">
          <div className="l-text">
            <h1>Welcome to Paywallet</h1>
          </div>
        </div>
      </div>
      <div className="l-container-right">
        <div className="l-up">
          <div className="l-logo text-center">
            <img src={paywalletLogo} alt="" height="100" />
            <h6 style={{marginTop:"40px"}}>{showerrorCode}</h6>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Allocation;
