export interface State {
  online: boolean;
  loading: boolean;
}

const defaultState: State = {
  loading: false,
  online: false,
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ONLINE"; payload: boolean };

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

    default:
      return state;
  }
};
