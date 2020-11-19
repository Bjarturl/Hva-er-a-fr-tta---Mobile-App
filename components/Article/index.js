import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import TypeWriter from "react-native-typewriter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { GET } from "../../services/api_endpoints";
import AddToFavorites from "../AddToFavorites";
import { initFavorites } from "../../redux/actions";
import Storage from "../../services/storage";
import Content from "./content";

// Function that handles article logic
function Article({ initFavorites }) {
  // Initialize state variables
  const [article, setArticle] = useState({});
  const [infoText, setInfoText] = useState("Bý til frétt...");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  // Fetch favorites from storage on app load
  useEffect(() => {
    Storage.getFavorites().then((data) => {
      initFavorites(data);
    });
  }, []);

  // Fetch a random article from API
  const getArticle = async () => {
    if (!loading) {
      setLoading(true);
      await GET.random_article().then((data) => {
        setLoading(false);
        setArticle(data);
        scrollViewRef.current.scrollTo({ y: 0, x: 0, animated: true }); // Scroll to top
        return data;
      });
    }
  };

  return (
    <View style={{ flex: 1, padding: 8 }}>
      {/* If no article loaded (app just booted), display app info */}
      {!article.headline ? (
        <View>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
          >
            Velkomin/nn!
          </Text>
          <Text style={styles.infoText}>
            {`\nFréttirnar í þessu appi eru myndaðar út frá raunverulegum fréttum af Vísi og Mbl.
            \n\nTil að byrja að mynda nýjar fréttir geturðu ýtt á hnappinn hér að neðan!
            \n\nEf þér líst sérstaklega vel á einhverja frétt geturðu bætt henni við í safnið þitt með því að ýta á hjartað hér að ofan.
            \n\nATH. ef fyrsta frétt er lengi að hlaðast inn þá er serverinn að ræsa sig vegna aðgerðaleysis. Getur tekið allt að 30 sek en eftir fyrstu frétt ætti biðtíminn að vera stuttur!`}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
      {/* Add to favorites button */}
      <AddToFavorites article={article} />
      {/* Article content */}
      <ScrollView ref={scrollViewRef}>
        <Content article={article} />
      </ScrollView>
      {/* Custom button for fetching a new article */}
      <TouchableOpacity
        disabled={loading}
        onPress={() => {
          getArticle();
        }}
      >
        <View style={loading ? styles.disabled : styles.button}>
          <Text style={styles.buttonText}>
            {loading ? ( // If article is loading
              <View style={{ flex: 0, flexDirection: "row" }}>
                <TypeWriter
                  typing={1} // 1 means typing, 0 no typing and -1 erasing
                  maxDelay={50} // Max delay in ms between letters typed
                  onTypingEnd={() => {
                    // Reset typing animation .5 seconds after typing finishes
                    setInfoText("");
                    setTimeout(() => {
                      setInfoText("Bý til frétt...");
                    }, 500);
                  }}
                >
                  {/* Loading text */}
                  <Text style={styles.buttonText}>{infoText}</Text>
                </TypeWriter>
                {/* Typewriter icon */}
                <MaterialCommunityIcons
                  name="typewriter"
                  size={24}
                  color="white"
                  style={{ marginLeft: 10 }}
                />
              </View>
            ) : ( //Otherwise just display button text
              "Sækja nýja frétt"
            )}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Component styles
const styles = StyleSheet.create({
  infoText: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "coral",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    height: 45,
  },
  disabled: {
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    height: 45,
  },
  buttonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});

// Favorites from redux
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

export default connect(mapStateToProps, mapDispatchToProps)(Article);
