import React from "react";
import { StyleSheet, Text, Image, View } from "react-native";

// Function that renders article content
function Content({ article }) {
  return (
    <View>
      {/* Headline */}
      <Text style={styles.headline}>{article.headline}</Text>
      {/* News image */}
      <Image
        style={styles.image}
        source={{
          uri: article.image,
        }}
      />
      {/* Caption */}
      <Text style={styles.caption}>{article.caption}</Text>
      {/* Article */}
      <Text style={styles.article}>{article.article}</Text>
    </View>
  );
}

// Component styles
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
