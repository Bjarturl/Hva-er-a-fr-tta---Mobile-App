// import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
var ID = function () {
  return "_" + Math.random().toString(36).substr(2, 9);
};
const Storage = {
  getFavorites: async function () {
    return JSON.parse((await AsyncStorage.getItem("favorites")) || "[]");
  },
  getLastFavorite: async function () {
    var favorites = JSON.parse(
      (await AsyncStorage.getItem("favorites")) || "[]"
    );
    return favorites[favorites.length - 1];
  },
  addToFavorites: async function (article) {
    var favorites = await this.getFavorites();
    if (favorites.find((f) => f.article == article.article)) {
      return;
    }
    await AsyncStorage.setItem(
      "favorites",
      JSON.stringify([...favorites, { ...article, key: `${ID()}` }])
    );
  },
  removeFromFavorites: async function (article) {
    var favorites = await this.getFavorites();
    favorites = favorites.filter((f) => f.article != article.article);
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  },
  clearFavorites: async function () {
    await AsyncStorage.clear();
  },
  exists: async function (article) {
    var favorites = await this.getFavorites();
    if (favorites.find((f) => f.article == article.article)) {
      return true;
    }
    return false;
  },
};

export default Storage;
