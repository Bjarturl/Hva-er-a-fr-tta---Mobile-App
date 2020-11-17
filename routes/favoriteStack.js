import { createStackNavigator } from "react-navigation-stack";
import React from "react";

import Header from "../components/Header";
import Favorites from "../components/Favorites";

const screens = {
  Favorites: {
    screen: Favorites,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <Header title="Mínar fréttir" navigation={navigation} />
        ),
      };
    },
  },
};

const FavoriteStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: '#444',
    headerStyle: {
      height: 60,
      backgroundColor: "coral",
    },
  },
});

export default FavoriteStack;
