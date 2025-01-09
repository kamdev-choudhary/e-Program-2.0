interface States {
  loading: boolean;
  showAuth: boolean;
  authPage: boolean;
}

const initialState: States = {
  loading: false,
  showAuth: false,
  authPage: false,
};

export const rootReducers = (
  state = initialState,
  action: { type: string; payload: boolean }
): States => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_AUTHPAGE":
      return { ...state, authPage: action.payload };
    default:
      return state; // Return the current state if no action matches
  }
};
