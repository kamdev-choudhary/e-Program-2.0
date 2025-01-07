interface States {
  loading: boolean;
}

const initialState: States = {
  loading: false,
};

export const rootReducers = (
  state = initialState,
  action: { type: string; payload: boolean }
): States => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state; // Return the current state if no action matches
  }
};
