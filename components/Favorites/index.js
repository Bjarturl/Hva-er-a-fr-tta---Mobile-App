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
} from "react-native";
import Storage from "../../services/storage";
import { MaterialIcons } from "@expo/vector-icons";

import { connect } from "react-redux";
import { initFavorites } from "../../redux/actions";
import { bindActionCreators } from "redux";
import Content from "../Article/content";
// Function that displays favorite articles from local storage
function Favorites({ favorites, initFavorites, navigation }) {
  const [curr, setCurr] = useState("");
  const handlePress = (key) => {
    setCurr(key);
  };
  const handleArrowPress = (dir) => {
    if(dir == "left") {
      if(curr == 0) {
        setCurr(favorites.length - 1);
      } else {
        setCurr((prevCurr) => {
          return prevCurr - 1;
        })
      }
    }
    if(dir == "right") {
      if(curr == favorites.length - 1) {
        setCurr(0);
      } else {
        setCurr((prevCurr) => {
          return prevCurr + 1;
        })
      }
    }
  }
  const removeCurrent = () => {
    Storage.removeFromFavorites(favorites[curr]).then(() => {
      Storage.getFavorites().then((data) => {
        initFavorites(data);
        setCurr("");
      });
    });
  }
  if (curr !== "") {
    return (
      <View style={{ flex: 1, padding: 8 }}>
        <View style={{flex:0, flexDirection:"row", justifyContent: "center"}}>
      
          <View style={{position: "absolute", left: 0}}><MaterialIcons name="arrow-back" size={32} onPress={() => handleArrowPress("left")} /></View>
          <View><MaterialIcons name="view-list" size={32} onPress={() => setCurr("")} /></View>
          <View><MaterialIcons name="delete" size={32} onPress={removeCurrent} color="red" /></View>
          <View style={{position: "absolute", right: 0}}><MaterialIcons name="arrow-forward" size={32} onPress={() => handleArrowPress("right")} /></View>
        </View>
        <ScrollView style={{flex: 1}}>
        <Text style={{fontSize: 20}}>{curr+1}</Text>
          <Content article={favorites[curr]} />
        </ScrollView>

      </View>
    );
  }
  return (
    <View style={{ flex: favorites.length == 0 ? 0 : 1 }}>
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => {
                handlePress(index);
              }}
            >
              <Text>{index+1}</Text>
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
      {favorites.length == 0 ? (
        <Text style={styles.info}>
          Engar uppáhalds fréttir skráðar. Skoðaðu fréttir og smelltu á hjartað
          efst í hægra horninu til að geyma þær!
        </Text>
      ) : (
        <Button
          title="Hreinsa lista"
          color="red"
          onPress={() => {
            Storage.clearFavorites().then(() => {
              initFavorites([]);
            });
          }}
        />
      )}
    </View>
  );
}
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

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
