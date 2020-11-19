import { createStackNavigator } from "react-navigation-stack";
import React from "react";

import Header from "../components/Header";
import Article from "../components/Article";

// Home page stack
const screens = {
  Article: {
    screen: Article,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          // Render custom header component
          <Header title="Hvað er að frétta?" navigation={navigation} />
        ),
      };
    },
  },

};

const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerStyle: {
      height: 60,
      backgroundColor: "coral",
    },
  },
});

export default HomeStack;
