import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { initFavorites } from "../../redux/actions";
import Storage from "../../services/storage";
import Content from "../Article/content";

// Function that displays favorite articles from local storage
function Favorites({ favorites, initFavorites }) {
  // Selected favorite
  const [curr, setCurr] = useState("");

  // Handle article pressing from grid view
  const handlePress = (key) => {
    setCurr(key);
  };

  // When user presses back button on phone, go to grid view
  const handleBacking = () => {
    setCurr("");
    // Double tapping back exits app
    if (global.backPresses >= 2) {
      BackHandler.exitApp();
    }
    return true;
  };
  // Add back button handler when selecting an article, otherwise remove it
  useEffect(() => {
    if (curr == "") {
      BackHandler.addEventListener("hardwareBackPress", handleBacking);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", handleBacking);
    }
  }, [curr]);

  // Change index when user presses left or right arrow in favorites display
  const handleArrowPress = (dir) => {
    if (dir == "left") {
      if (curr == 0) {
        // Loop
        setCurr(favorites.length - 1);
      } else {
        setCurr((prevCurr) => {
          return prevCurr - 1;
        });
      }
    }
    if (dir == "right") {
      if (curr == favorites.length - 1) {
        // Loop
        setCurr(0);
      } else {
        setCurr((prevCurr) => {
          return prevCurr + 1;
        });
      }
    }
  };

  // When delete all button is pressed
  const deleteAll = () => {
    // Confirm button press
    Alert.alert(
      "Hreinsa lista",
      "Ertu viss um að þú viljir eyða öllum fréttum úr listanum?",
      [
        {
          text: "Nei",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Já",
          onPress: () => {
            Storage.clearFavorites().then(() => {
              initFavorites([]);
            });
          },
        },
      ]
    );
  };

  // When trash can is pressed (delete a single favorite)
  const removeCurrent = () => {
    // Confirm button press
    Alert.alert("Eyða frétt", "Ertu viss um að þú viljir eyða þessari frétt?", [
      {
        text: "Nei",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Já",
        onPress: () => {
          var index = curr;
          setCurr("");
          Storage.removeFromFavorites(favorites[index]).then(() => {
            Storage.getFavorites().then((data) => {
              initFavorites(data);
            });
          });
        },
      },
    ]);
  };
  // If an item is selected display content along with header and footer
  if (curr !== "") {
    return (
      <View style={{ flex: 1, padding: 8 }}>
        {/* Header menu */}
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <MaterialIcons
              name="view-list"
              size={40}
              onPress={() => setCurr("")}
            />
          </View>
          <View>
            <MaterialIcons
              name="delete"
              size={40}
              onPress={removeCurrent}
              color="red"
            />
          </View>
        </View>
        {/* Content */}
        <ScrollView style={{ flex: 1 }}>
          {/* Navigate with swiping enabled */}
          <GestureRecognizer
            onSwipeLeft={() => handleArrowPress("right")}
            onSwipeRight={() => handleArrowPress("left")}
            config={{
              velocityThreshold: 0.3,
              directionalOffsetThreshold: 80,
            }}
          >
            <Content article={favorites[curr]} />
          </GestureRecognizer>
        </ScrollView>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: 35,
          }}
        >
          {/* Footer menu */}
          <View style={{ position: "absolute", left: 0 }}>
            <MaterialIcons
              name="arrow-back"
              size={40}
              onPress={() => handleArrowPress("left")}
            />
          </View>
          <Text style={{ fontSize: 25 }}>
            {curr + 1} / {favorites.length}
          </Text>
          <View style={{ position: "absolute", right: 0 }}>
            <MaterialIcons
              name="arrow-forward"
              size={40}
              onPress={() => handleArrowPress("right")}
            />
          </View>
        </View>
      </View>
    );
  }
  return (
    // Otherwise return grid of all favorites
    <View style={{ flex: favorites.length == 0 ? 0 : 1 }}>
      <FlatList
        data={favorites.sort((a, b) => a.dateAdded < b.dateAdded)}
        numColumns={2}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item, index }) => (
          // Favorite card item
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => {
                handlePress(index);
              }}
            >
              <View
                style={{
                  flex: 0,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 12 }}>
                  {item.dateAdded.split("T")[0].split("-").reverse().join("-")}
                </Text>
                <Text style={{ marginRight: 5 }}>{index + 1}</Text>
              </View>
              <Text style={styles.headline} numberOfLines={2}>
                {item.headline}
              </Text>
              <Image
                style={styles.image}
                source={{
                  uri: item.image,
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      />
      {/* If no favorites have been recorded, display info on how to */}
      {favorites.length == 0 ? (
        <Text style={styles.info}>
          Engar uppáhalds fréttir skráðar. Skoðaðu fréttir og smelltu á hjartað
          efst í hægra horninu til að geyma þær!
        </Text>
      ) : (
        // Delete all favorites
        <Button
          title="Hreinsa lista"
          color="red"
          onPress={() => {
            deleteAll();
          }}
        />
      )}
    </View>
  );
}

// Component styles
const styles = StyleSheet.create({
  info: {
    textAlign: "center",
    color: "#000",
    fontSize: 16,
    padding: 10,
  },
  card: {
    width: "50%",
    borderWidth: 2,
    borderColor: "coral",
    height: 200,
    overflow: "hidden",
  },
  headline: {
    fontWeight: "bold",
    padding: 3,
    fontSize: 15,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
});

// Redux favorites
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

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
