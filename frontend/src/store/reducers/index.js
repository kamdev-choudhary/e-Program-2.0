// src/store/reducers/index.js
const initialState = {
  loading: false,
  authPage: false,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_AUTHPAGE":
      return { ...state, authPage: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
