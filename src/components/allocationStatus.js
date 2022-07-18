import React from "react";
import paywalletLogo from "../assets/images/paywalletLogo.svg";
import successIcon from "../assets/images/success.svg";

const AllocationStatus = (props) => {
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
            <h2>Allocation Status</h2>
            <br />
          </div>
          <div className="l-text-msg text-center">
            <img className="l-transition-icon" src={successIcon} alt="" />
            <h2>Success</h2>
            <p className="l-status-msg">
              Pay allocation successfully submitted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationStatus;
