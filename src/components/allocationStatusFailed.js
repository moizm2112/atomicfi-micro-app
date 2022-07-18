import React from "react";
import paywalletLogo from "../assets/images/paywalletLogo.svg";
import FailIcon from "../assets/images/failed.svg";

const AllocationStatusFailed = (props) => {
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
            <img className="l-transition-icon" src={FailIcon} alt="" />
            <h2>Failed</h2>
            <p className="l-status-msg">
              Pay allocation Failed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationStatusFailed;
