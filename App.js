import React from "react";
import { StyleSheet, View } from "react-native";
import Navigator from "./routes/drawer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import favoriteReducer from "./redux/reducers";

const store = createStore(favoriteReducer);

export default function App() {

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Navigator />
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
  },
  content: {
    flex: 1,
  },
});
