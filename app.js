const express = require('express');
const app = express();
const port = 3000;

const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

db.one('SELECT 1')
  .then(data => {
    console.log('Połączenie z bazą danych jest poprawne');
  })
  .catch(error => {
    console.error('Błąd połączenia z bazą danych:', error);
  });
  

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})