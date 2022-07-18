import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/main.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/login";
import Allocation from "./components/allocation";
import AllocationStatus from "./components/allocationStatus";
import LoginStatus from "./components/loginStatus";
import AllocationStatusFailed from "./components/allocationStatusFailed";
import LoginStatusFailed from "./components/loginStatusFailed";
import TokenExpiry from './components/tokenExpiry'
import $ from 'jquery';
import 'bootstrap';
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import {sendAuthAction} from "../src/store/actions/sdk-login/index";

function App() {
  const [globalState, setglobalState]=React.useState(localStorage.getItem('expireToken'))
 // const [globalState, setglobalState] = React.useState()
  
  React.useEffect(()=>{
    const  State  = localStorage.getItem('expireToken')
    setglobalState(State)
    console.log(globalState);
  })
  
  const dispatch = useDispatch();
  
  const authTokenRequest = async () => {
    const object = qs.stringify({
      client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
      client_secret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET,
      grant_type: process.env.REACT_APP_KEYCLOAK_GRANT_TYPE,
    });

    await dispatch(sendAuthAction(object, dispatch)).then((response) => {
      console.log('auth', response);
      $("#myModal").css("display", "none");
      setglobalState(null)
      //window.location.reload(); 
    });
  };
  const loadAPI=()=>{
    localStorage.removeItem('expireToken')
    authTokenRequest();
  }
  
  // const hideModal=()=>{
  //   $("#myModal").css("display", "none");
  // }

  function redirectModal(){
    localStorage.removeItem('expireToken')
    let homeUrl;
    if (window.location.hostname === "localhost") {
      homeUrl ='http://localhost:3000/tokenExpiry';
    } else {
      homeUrl = 'https://bvr-dev.paywalletllc.com/tokenExpiry';
    }
    window.location.replace(
      `${homeUrl}`
    );
  }
  
  return (
    <span> 
      {
         globalState == "inavlid token" ? 
         <div className="modal fade" style={{display:"contents"}} id="myModal"  role="dialog">
          <div className="modal-dialog" style={{marginTop: "100px"}}>
            <div className="modal-content">
              <div className="modal-header" style={{display:"initial"}}>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Alert !</h4>
              </div>
              <div className="modal-body">
                <p>Your session has expired do you want to continue ?</p> 
              </div>
              <div className="modal-footer" style={{display:"block"}}>
                <div className="row">
                  <div className="col-sm-6">
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={loadAPI}>Yes</button>
                  </div>
                  <div className="col-sm-6">
                  <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={redirectModal}>No</button>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
        :
        globalState === null  ?
        <Router>
          <div>
            <Switch> 
            <Route exact path="/login/:requestId/:provider" component={Login} />
              <Route exact path="/allocation/:requestId/:provider" component={Allocation} />
              <Route exact path="/allocationstatus" component={AllocationStatus} />
              <Route exact path="/loginstatus" component={LoginStatus} />
              <Route exact path="/allocationstatusfailed" component={AllocationStatusFailed} />
              <Route exact path="/loginstatusfailed" component={LoginStatusFailed} />
              <Route exact path="/tokenExpiry" component={TokenExpiry} />
            </Switch>
          </div>
        </Router>
        :
        <div className="modal fade" style={{display:"contents"}} id="myModal"  role="dialog">
          <div className="modal-dialog" style={{marginTop: "100px"}}>
            <div className="modal-content">
              <div className="modal-header" style={{display:"initial"}}>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Alert !</h4>
              </div>
              <div className="modal-body">
                <p>Your session has expired do you want to continue ?</p> 
              </div>
              <div className="modal-footer" style={{display:"block"}}>
                <div className="row">
                  <div className="col-sm-6">
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={loadAPI}>Yes</button>
                  </div>
                  <div className="col-sm-6">
                  <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={redirectModal}>No</button>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
      }
    </span>
  );
}

export default App;
