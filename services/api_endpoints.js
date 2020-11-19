import { API_URL } from "./constants";

export const GET = {
  // Sends a general get request to a given URL and returns the data
  async sendGetRequest(url) {
    return fetch(url, {
      method: "GET",
      headers: new Headers(),
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
  },

  // Fetches a random article from the API
  async random_article() {
    var article = "";
    var tries = 0;
    var defaultImg = // Default placeholder in case Vísir or Mbl image is not hosted anymore on their site
      "https://i.picsum.photos/id/1/5616/3744.jpg?hmac=kKHwwU8s46oNettHKwJ24qOlIAsWN9d2TtsXDoCWWsQ";
    // Try fetching article until successful
    while (article == "") {
      try {
        if (tries == 10) {
          // Something's wrong on the server side, return empty article
          return {
            headline: "",
            caption: "",
            image: defaultImg,
            article: "",
          };
        }
        article = await this.sendGetRequest(API_URL + "news_article");
        var articleStr = "";
        // Split article into paragraphs instead of single block of text
        for (var i in article.article) {
          if (article.article[i] != "") {
            articleStr += article.article[i] + ". ";
          }
          // Every three periods insert linebreaks
          if ((i + 1) % 3 == 0) {
            articleStr += "\n\n";
          }
        }
        article.article = articleStr;
        // If no image found use placeholder
        if (article.image == "") {
          article.image = defaultImg;
        }
      } catch {
        article = "";
        tries += 1;
      }
    }
    return article;
  },
};
