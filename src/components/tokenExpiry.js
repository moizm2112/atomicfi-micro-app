import {Link} from 'react-router-dom';

const tokenExpiry = () => {
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
          <div className="l-text-msg text-center">
            
            <h5 className="l-status-msg l-msg-lg">
            Please contact your administrator to get a new link
            </h5>
          </div>
        </div>
      </div>
    </div>
    )
}
export default tokenExpiry;