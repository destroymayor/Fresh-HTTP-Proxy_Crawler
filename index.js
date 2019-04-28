import cheerio from "cheerio";
const superagent = require("superagent");
require("superagent-proxy")(superagent);

const getProxyUrl = async url => {
  const IP_proxy_RequestList = [];
  try {
    const RequestHTML = await superagent.get(url);
    const $ = cheerio.load(RequestHTML.text);
    $(`#page > table.bg > tbody > tr`).map((index, value) => {
      const IP_http =
        $(value)
          .children("td:nth-child(7)")
          .text() === "no"
          ? "http"
          : "https";
      const IP_url = $(value)
        .children("td:nth-child(2)")
        .text();
      const IP_port = $(value)
        .children("td:nth-child(3)")
        .text();
      IP_proxy_RequestList.push(`${IP_http}://${IP_url}:${IP_port}`);
    });

    Promise.all(
      IP_proxy_RequestList.map(async link => {
        try {
          const testIp = await superagent
            .get("https://www.google.com.tw")
            .proxy(link)
            .timeout(3000);
          if (testIp.statusCode == 200 && link !== "https://:") {
            console.log(link);
          }
        } catch (error) {}
      })
    );
  } catch (error) {
    console.log("TCL: getWebSitePageUrl -> error", error);
  }
};

for (let i = 0; i <= 6; i++) {
  getProxyUrl("https://list.proxylistplus.com/Fresh-HTTP-Proxy-List-" + i);
}
