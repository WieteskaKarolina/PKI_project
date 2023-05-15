const express = require('express');
const pgp = require('pg-promise')();
const app = express();
const port = 3000;
const db = pgp(process.env.DATABASE_URL);

// app.use(express.static('views'));
// app.set('view engine', 'ejs');

app.get('/databaseName', (req, res) => {
  db.one('SELECT current_database()')
    .then(data => {
      res.send(data.current_database);
    })
    .catch(error => {
      console.error('Błąd pobierania nazwy bazy danych:', error);
      res.status(500).send('Wystąpił błąd serwera');
    });
});

app.get('/tableList', (req, res) => {
  db.any("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'")
    .then(data => {
      const tableList = data.map(row => row.table_name);
      res.send(tableList);
    })
    .catch(error => {
      console.error('Błąd pobierania listy tabel:', error);
      res.status(500).send('Wystąpił błąd serwera');
    });
});

app.get('/tableContent', (req, res) => {
  const tableName = req.query.table;

  db.any(`SELECT * FROM ${tableName}`)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.error('Błąd pobierania zawartości tabeli:', error);
      res.status(500).send('Wystąpił błąd serwera');
    });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

