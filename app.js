require('dotenv').config();
const express = require('express');
const app = express();
const rssRoute = require('./src/routes/rssRoute');

app.use(express.json());
app.use('/rss', rssRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/rss`);
});
