import { combineReducers } from "redux";
import { authReducer } from "./auth-reducer/auth-reducer";
const rootReducer = combineReducers({
  authReducer: authReducer,
});

export default rootReducer;
