import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { GET } from "../../services/api_endpoints";
import AddToFavorites from "../AddToFavorites";
import { connect } from "react-redux";
import Storage from "../../services/storage";
import { initFavorites } from "../../redux/actions";
import { bindActionCreators } from "redux";
import Content from "./content";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TypeWriter from "react-native-typewriter";

function Article({ initFavorites }) {
  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
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
      {!article.headline ? (
        <View>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
          >
            {"Velkomin/nn!"}
          </Text>
          <Text style={styles.infoText}>
            {
              "\nFréttirnar í þessu appi eru myndaðar út frá raunverulegum fréttum af Vísi og Mbl."
            }
          </Text>
          <Text style={styles.infoText}>
            {
              "\nTil að byrja að mynda nýjar fréttir geturðu ýtt á hnappinn hér að neðan!"
            }
          </Text>
          <Text style={styles.infoText}>
            {
              "\nEf þér líst sérstaklega vel á einhverja frétt geturðu bætt henni við í safnið þitt með því að ýta á hjartað hér að ofan."
            }
          </Text>
        </View>
      ) : (
        <View></View>
      )}
      <AddToFavorites article={article} />
      <ScrollView ref={scrollViewRef}>
        <Content article={article} />
      </ScrollView>
      <TouchableOpacity
        disabled={loading}
        onPress={() => {
          getArticle();
        }}
      >
        <View style={loading ? styles.disabled : styles.button}>
          <Text style={styles.buttonText}>
            {loading ? (
              <View style={{ flex: 0, flexDirection: "row" }}>
                <TypeWriter
                  typing={1}
                  maxDelay={50}
                >
                  <Text style={styles.buttonText}>Bý til frétt...</Text>
                </TypeWriter>
                <MaterialCommunityIcons
                  name="typewriter"
                  size={24}
                  color="white"
                  style={{ marginLeft: 10 }}
                />
              </View>
            ) : (
              "Sækja nýja frétt"
            )}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Article);
