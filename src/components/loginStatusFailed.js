import React from "react";
import paywalletLogo from "../assets/images/paywalletLogo.svg";
import failIcon from "../assets/images/failed.svg";
import { useHistory } from "react-router-dom";

const LoginStatusFailed = (props) => {
  const history = useHistory();

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
          </div>
          <div className="l-text-msg text-center">
            <br />
          </div>
          <div className="l-text-msg text-center">
            <img className="l-transition-icon" src={failIcon} alt="" />
            <h2>Failed</h2>
            <br />
            <p className="l-status-msg l-msg-lg">
              Login Failed. <br />
            </p>
            Click here to{" "}
            <span
            style={{color:"blue", cursor:"pointer"}}
              onClick={() => {
                window.history.go(-1);
              }}
            >
              Login
            </span>{" "}
            again.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginStatusFailed;
