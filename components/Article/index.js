import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, ScrollView, Text } from "react-native";
import { GET } from "../../services/api_endpoints";
import AddToFavorites from "../AddToFavorites";
import { connect } from "react-redux";
import Storage from "../../services/storage";
import { initFavorites } from "../../redux/actions";
import { bindActionCreators } from "redux";
import Content from "./content";
function Article({ initFavorites }) {
  const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(false);
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
        return data;
      });
    }
  };

  // Set article if it doesn't exist (on app launch)
  // if (!article.headline) {
  //   getArticle();
  // }

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
      <ScrollView>
        <Content article={article} />
      </ScrollView>
      <Button
        onPress={() => getArticle()}
        disabled={loading}
        title={loading ? "Bý til frétt..." : "Sækja nýja frétt"}
        color="coral"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  infoText: {
    fontSize: 16,
    textAlign: "center",
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
