import cheerio from "cheerio";
const superagent = require("superagent");
require("superagent-proxy")(superagent);

const getProxyUrl1 = async (url, tableTr, tdChild_IPHttp, tdChild_URL, tdChild_Port) => {
  const IP_proxy_RequestList = [];
  try {
    const RequestHTML = await superagent.get(url);
    const $ = cheerio.load(RequestHTML.text);
    $(tableTr).map((index, value) => {
      const IP_http =
        $(value)
          .children(tdChild_IPHttp)
          .text() === "no"
          ? "http"
          : "https";
      const IP_url = $(value)
        .children(tdChild_URL)
        .text();
      const IP_port = $(value)
        .children(tdChild_Port)
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

//https://list.proxylistplus.com/Fresh-HTTP-Proxy-List-1
for (let i = 0; i <= 6; i++) {
  getProxyUrl1(
    `https://list.proxylistplus.com/Fresh-HTTP-Proxy-List-${i}`,
    "#page > table.bg > tbody > tr",
    "td:nth-child(7)",
    "td:nth-child(2)",
    "td:nth-child(3)"
  );
}

// getProxyUrl1(
//   "https://free-proxy-list.net/",
//   "#proxylisttable > tbody > tr",
//   "td:nth-child(7)",
//   "td:nth-child(1)",
//   "td:nth-child(2)"
// );
