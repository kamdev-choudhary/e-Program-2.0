// src/store/reducers/index.js
const initialState = {
  loading: false,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }; // Set loading state based on the payload
    default:
      return state;
  }
};

export default rootReducer;
