export const addFavorite = favorite => (
    {
      type: 'ADD_FAVORITE',
      payload: favorite,
    }
  );
export const initFavorites = favorites => (
    {
      type: 'INIT_FAVORITES',
      payload: favorites
    }
  );