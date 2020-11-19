import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-simple-toast";
import { MaterialIcons } from "@expo/vector-icons";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Storage from "../../services/storage";
import { initFavorites } from "../../redux/actions";

// Function to add articles to favorites
function AddToFavorites({ article, initFavorites, favorites }) {
  const [icon, setIcon] = useState("favorite-border");
  const [color, setColor] = useState("black");

  // Reset heart when article changes
  useEffect(() => {
    setIcon("favorite-border");
  }, [article]);

  // When favorites state changes we also want to change the heart color
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

  // Update favorites
  useEffect(() => {
    // Function that adds articles to favorites storage asynchronously
    async function updateFavorites() {
      if (icon === "favorite") {
        // This means heart was pressed
        Storage.addToFavorites(article).then((msg) => {
          Toast.show(msg);
          Storage.getFavorites().then((data) => {
            initFavorites(data);
          });
        });
      } else {
        // Otherwise remove article if exists from favorites
        Storage.removeFromFavorites(article).then(() => {
          Storage.getFavorites().then((data) => {
            initFavorites(data);
          });
        });
      }
    }
    updateFavorites();
  }, [icon]);

  // Change icon style when heart is pressed
  const changeIcon = () => {
    // If heart was pressed without an article loaded, do nothing
    if (!article.article) {
      return;
    }
    setIcon((prevIcon) => {
      if (prevIcon == "favorite-border") {
        return "favorite";
      } else {
        // Only applies if user removes from favorites in front page menu
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

// Component styles
const styles = StyleSheet.create({
  content: {
    position: "absolute",
    right: 10,
    top: -30,
    zIndex: 999,
  },
});

// Redux props
const mapStateToProps = (state) => {
  const { favorites } = state;
  return { favorites };
};

// Redux actions
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      initFavorites,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddToFavorites);
