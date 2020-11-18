import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";

import HomeStack from "./homeStack";
import FavoriteStack from "./favoriteStack";

const RootDrawerNavigator = createDrawerNavigator(
  {
    Article: {
      screen: HomeStack,
      navigationOptions: {
        title: "Hvað er að frétta?",
      },
    },
    Favorites: {
      screen: FavoriteStack,
      navigationOptions: {
        title: "Mínar fréttir",
      },
    },
  },
  {
    drawerBackgroundColor: "coral",
    drawerWidth: 250,
    contentOptions: {
      inactiveTintColor: 'white',
      activeTintColor: '#2E2E2E'
    },
  }
);

export default createAppContainer(RootDrawerNavigator);
