export interface State {
  online: boolean;
  loading: boolean;
  showAuth: boolean;
  showForgotPassword: boolean;
}

const defaultState: State = {
  loading: false,
  online: false,
  showAuth: false,
  showForgotPassword: false,
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ONLINE"; payload: boolean }
  | { type: "SET_AUTHPAGE"; payload: boolean }
  | { type: "SET_FORGOTPASSWORD"; payload: boolean };

// Retrieve and validate stored state

// Ensure initialState is always of type State
const initialState: State = defaultState;

export const rootReducers = (
  state: State = initialState, // Ensure state is always of type State
  action: Action
): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ONLINE":
      return { ...state, online: action.payload };
    case "SET_AUTHPAGE":
      return { ...state, showAuth: action.payload };
    case "SET_FORGOTPASSWORD":
      return { ...state, showForgotPassword: action.payload };
    default:
      return state;
  }
};
