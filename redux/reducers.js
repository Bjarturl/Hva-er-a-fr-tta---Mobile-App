import { combineReducers } from "redux";

// On app startup
const INITIAL_STATE = {
  favorites: [],
};

const favoritesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "INIT_FAVORITES":
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  favorites: favoritesReducer,
});
