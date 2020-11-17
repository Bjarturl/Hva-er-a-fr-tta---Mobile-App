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
    var article = ""
    var tries = 0
    var defaultImg = "https://i.picsum.photos/id/1/5616/3744.jpg?hmac=kKHwwU8s46oNettHKwJ24qOlIAsWN9d2TtsXDoCWWsQ";
    while(article == "") { // Try fetching article until successful
      try {
        if(tries == 10) {
          return {
            headline: "",
            caption: "",
            image: defaultImg,
            article: ""
          }
        }
        article = await this.sendGetRequest(API_URL + "news_article");
        var articleStr = ""
        for(var i in article.article) {
          if(article.article[i] != "") {
            articleStr += article.article[i] + ". "
          }
          if((i+1) % 3 == 0) {
            articleStr += "\n\n"
          }
        }
        article.article = articleStr
        if(article.image == "") {
          article.image = defaultImg;
        }
      } catch {
        article = ""
        tries += 1
      }
    }
    return article
  },
};
