require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.get('/api/shorturl', function(req, res) {
  console.log("shorturl");
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
let urls = [];
let id = 1;
app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url;

  // Validar URL usando dns.lookup para verificar dominio
  const parsedUrl = urlParser.parse(original_url);

  if (!/^https?:\/\//.test(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(parsedUrl.hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      const short_url = id++;
      urls.push({ original_url, short_url });
      res.json({ original_url, short_url });
    }
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = Number(req.params.short_url);
  const record = urls.find(entry => entry.short_url === short_url);

  if (record) {
    res.redirect(record.original_url);
  } else {
    res.json({ error: 'No short URL found for given input' });
  }
});
