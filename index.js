const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const { scrapeLogic2 } = require("./scrapeLogic2");
const { scrapeLogic3 } = require("./scrapeLogic3");
const { go } = require("./login");
const { go2 } = require("./login2");
const { go3 } = require("./login3");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  const { url, cookieValue, proxy } = req.query;
  scrapeLogic(res, url, cookieValue, proxy);
});

app.get("/scrape2", (req, res) => {
  const { url, cookieValue, proxy } = req.query;
  scrapeLogic2(res, url, cookieValue, proxy);
});

app.get("/scrape3", (req, res) => {
  const { url, cookieValue, proxy } = req.query;
  scrapeLogic3(res, url, cookieValue, proxy);
});

app.get("/login", (req, res) => {
  const { url, user,pass, proxy } = req.query;
  go(res, url, user,pass, proxy);
});

app.get("/login2", (req, res) => {
  const { url, user,pass, proxy } = req.query;
  go2(res, url, user,pass, proxy);
});

app.get("/login3", (req, res) => {
  const { url, user,pass, proxy } = req.query;
  go3(res, url, user,pass, proxy);
});


app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
