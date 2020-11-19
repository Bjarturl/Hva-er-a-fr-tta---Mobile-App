import AsyncStorage from "@react-native-community/async-storage";

// Creates unique identifier for each favorite
// Not perfect but odds of this creating duplicate ids are extremely low
var ID = function () {
  return "_" + Math.random().toString(36).substr(2, 9);
};

// Storage functions
const Storage = {
  // Fetches all favorites from storage
  getFavorites: async function () {
    var favorites = JSON.parse(
      (await AsyncStorage.getItem("favorites")) || "[]"
    );
    return favorites;
  },

  // Adds selected article to favorites and returns status message
  addToFavorites: async function (article) {
    var favorites = await this.getFavorites();
    if (favorites.find((f) => f.article == article.article)) {
      return "";
    }
    // Limit favorites to 100 because we are using phone storage
    if (favorites.length == 100) {
      return "Ekki tókst að bæta við grein. Hámarksfjölda greina náð (100).";
    }
    // Add article to storage
    await AsyncStorage.setItem(
      "favorites",
      JSON.stringify([
        ...favorites,
        { ...article, key: `${ID()}`, dateAdded: new Date() },
      ])
    );
    return "Grein bætt í safn.";
  },

  // Remove article from storage
  removeFromFavorites: async function (article) {
    var favorites = await this.getFavorites();
    favorites = favorites.filter((f) => f.article != article.article);
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  },

  // Remove all articles from storage
  clearFavorites: async function () {
    await AsyncStorage.clear();
  },

  // Check if article exists in storage already
  exists: async function (article) {
    var favorites = await this.getFavorites();
    if (favorites.find((f) => f.article == article.article && f.headline == article.headline)) {
      return true;
    }
    return false;
  },
};

export default Storage;
