import { combineReducers } from "redux";

const INITIAL_STATE = {
  favorites: [],
};

const favoritesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      const { favorites } = state;
      var tmp;
      if(!favorites) {
        tmp = [action.payload]
      } else {
        tmp = [...favorites, action.payload]
      }
      const newState = { tmp };
      return newState;
    case "INIT_FAVORITES":
      return action.payload;
    default:
      return state;
  }
};
export default combineReducers({
  favorites: favoritesReducer,
});
