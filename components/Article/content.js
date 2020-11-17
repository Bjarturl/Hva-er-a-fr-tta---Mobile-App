import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
} from "react-native";

function Content({ article }) {
  return (
    <View>
      <Text style={styles.headline}>{article.headline}</Text>

      <Image
        style={styles.image}
        source={{
          uri: article.image,
        }}
      />
      <Text style={styles.caption}>{article.caption}</Text>
      <Text style={styles.article}>{article.article}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
  caption: {
    fontStyle: "italic",
    marginBottom: 10,
  },
  article: {
    marginBottom: 10,
  },
});

export default Content;
