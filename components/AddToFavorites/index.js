import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import Storage from "../../services/storage";
import { initFavorites } from "../../redux/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Function to add articles to favorites
function AddToFavorites({ article, initFavorites, favorites }) {
  const [icon, setIcon] = useState("favorite-border");
  const [color, setColor] = useState("black");

  // Reset state when article changes
  useEffect(() => {
    setIcon("favorite-border");
  }, [article]);
  useEffect(() => {
    Storage.exists(article).then((exists) => {
      if (exists) {
        setIcon("favorite");
        setColor("red");
      } else {
        setIcon("favorite-border");
        setColor("black");
      }
    });
  }, [favorites]);

  // Update state with added favorites
  useEffect(() => {
    async function updateFavorites() {
      if (icon === "favorite") {
        // This means heart was pressed
        Storage.addToFavorites(article).then((msg) => {
          Toast.show(msg);
          Storage.getFavorites().then((data) => {
            initFavorites(data);
            // setColor("red");
          });
        });
      } else {
        // Otherwise remove article if exists from favorites
        Storage.removeFromFavorites(article).then(() => {
          Storage.getFavorites().then((data) => {
            initFavorites(data);
            // setColor("black");
          });
        });
      }
    }
    updateFavorites();
  }, [icon]);

  // Notify user what happened and change icon style when heart is pressed
  const changeIcon = () => {
    if (!article.article) {
      return;
    }
    setIcon((prevIcon) => {
      if (prevIcon == "favorite-border") {
        return "favorite";
      } else {
        Toast.show("Grein fjarlægð úr safni.");
        return "favorite-border";
      }
    });
  };

  return (
    <View style={styles.content}>
      <MaterialIcons name={icon} size={24} onPress={changeIcon} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    position: "absolute",
    right: 10,
    top: -30,
    zIndex: 999,
  },
});
const mapStateToProps = (state) => {
  const { favorites } = state;
  return { favorites };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      initFavorites,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddToFavorites);
