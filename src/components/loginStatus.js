import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import paywalletLogo from "../assets/images/paywalletLogo.svg";
import successIcon from "../assets/images/success.svg";
import pendingIcon from '../assets/images/pending.svg'

const LoginStatus = (props) => {

  const [offlineAllocationData, setofflineAllocationData] = useState();

  const location = useLocation();

  useEffect(() => {
    console.log("SDebug > uselocation", location);
    if (
      location && location.state &&
      location.state.detail &&
      location.state.detail.offlineAllocationInitiationInfo
    ) {
      setofflineAllocationData(
        location.state.detail.offlineAllocationInitiationInfo
      );
    }
  }, []);

  return (
    <>
  {localStorage.getItem("pdSupport") === "true" || offlineAllocationData === undefined? (
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
            <img className="l-transition-icon" src={successIcon} alt="" />
            <h2>Success</h2>
            <br />
            <p className="l-status-msg l-msg-lg">
              You have successfully connected and authorized to share your
              payroll data. <br />
              Kindly await e-mail/sms for further actions at your end to
              <br /> complete the direct deposit setup.
            </p>
            <p className="l-status-msg l-msg-lg">
              In the meantime, please contact 180-000-0000 or <br /> visit{" "}
              <a href="http://yourpaywallet.com/contact" rel="" target="_blank">
                here
              </a>{" "}
              for any further queries.
            </p>
          </div>
        </div>
      </div>
    </div>
      ) : (
        <>
          {offlineAllocationData ? (
            <>
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
                      <img
                        className="l-transition-icon pending-icon"
                        src={pendingIcon}
                        alt=""
                      />
                      <h2>Allocation Pending</h2>
                      <br />
                      <p className="l-status-msg l-msg-lg">
                        Please contact your employer{" "}
                        {offlineAllocationData.employerName} requesting to send
                        ${offlineAllocationData.installmentAmount} per paycycle
                        directly from your salary to the account with below details for repayment towards your loan with{" "}
                        {offlineAllocationData.lender}{" "}
                      </p>
                      <br />
                      <table class="table">
                      <thead class="thead-dark">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>ABA#</td>
                          <td>{offlineAllocationData.abaNumber}</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Account#</td>
                          <td>{offlineAllocationData.accountNumber}</td>
                        </tr>
                      </tbody>
                      </table>
                      <br />
                      {offlineAllocationData.payrollProviderLink !== null &&
                      offlineAllocationData.payrollProviderLink !== "" && offlineAllocationData.payrollProviderLink !== undefined ? (
                        <>
                         
                          <p className="l-status-msg l-msg-lg">
                          Please complete your allocation by visiting employer
                            payroll system <br/>
                            <a
                              href={offlineAllocationData.payrollProviderLink}
                              rel=""
                              target="_blank"
                            >
                              click here
                            </a>
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default LoginStatus;
