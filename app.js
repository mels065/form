const express = require('express');
const pug = require('pug');
const path = require('path');
const fs = require('fs');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');

app.use('/css', express.static(path.join(__dirname, '/static/css')));
app.use('/images', express.static(path.join(__dirname, '/static/images')));

app.get('/', (req, res) => {
  try {
    const states = fs.readFileSync(path.join(__dirname, '/data/states.csv')).toString().split('\n');
    const breeds = fs.readFileSync(path.join(__dirname, '/data/breeds.csv')).toString().split('\n');
    return res.render('index', { states, breeds });
  }
  catch(err) {
    console.log(err);
  }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
