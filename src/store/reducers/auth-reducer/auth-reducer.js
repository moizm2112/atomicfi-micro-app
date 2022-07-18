import { AUTH_TOKEN } from "../../types/types";

const initialState = {
  authToken: "",
  timeLimit: 0,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_TOKEN:
      return {
        authToken: action.payload.authToken,
        timeLimit: action.payload.timeLimit,
      };
    default:
      return state;
  }
};
