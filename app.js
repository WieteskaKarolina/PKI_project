const express = require('express');
const app = express();
const port = 3000;

const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/tableList', (req, res) => {
  db.any("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'")
    .then(data => {
      const tableList = data.map(row => row.table_name);
      res.json(tableList); 
    })
    .catch(error => {
      console.error('Error retrieving table list:', error);
      res.status(500).send('An error occurred');
    });
});

app.get('/tableContent', (req, res) => {
  const tableName = req.query.table;

  db.any(`SELECT * FROM ${tableName}`)
    .then(data => {
      res.render('tableContent', { tableName, tableData: data });
    })
    .catch(error => {
      console.error('Błąd pobierania zawartości tabeli:', error);
      res.status(500).send('Wystąpił błąd serwera');
    });
});

app.get('/', (req, res) => {
  res.render('home', {
    databaseName: "pki_project_db", 
    tableList: [] //zostanie zaktualizowana przez asynchroniczne zapytanie AJAX
  });
});

app.post('/executeQuery', (req, res) => {
  var query = req.body.query;
  db.query(query)
    .then((result) => {
      res.json({ result: result });
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
