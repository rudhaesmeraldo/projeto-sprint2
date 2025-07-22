require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const rssRoute = require("./src/routes/rssRoute");

app.use(express.json());

app.use(express.static(path.join(__dirname, "src", "public")));

app.use("/data", express.static(path.join(__dirname, "src", "data")));

app.use("/rss", rssRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "views", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});