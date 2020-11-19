// Takes in array and sets favorites to equal that array
export const initFavorites = favorites => (
    {
      type: 'INIT_FAVORITES',
      payload: favorites
    }
  );