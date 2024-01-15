require('dotenv').config();
const dns = require('dns');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Basic Configuration
const port = 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
let urlList = [];
// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  inputUrl = req.body.url;
  const hostname = new URL(inputUrl).hostname;
  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' })
    }
    urlList.push(inputUrl);
    const lastElementIndex = urlList.length - 1;
    res.json({original_url:urlList[lastElementIndex], short_url:lastElementIndex});
  });
  
});

app.get('/api/shorturl/:shorturl',(req,res)=>{
  console.log(req.params.shorturl);
  const index = req.params.shorturl;
  const url = urlList[index]
  console.log(url);
  res.redirect(url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
