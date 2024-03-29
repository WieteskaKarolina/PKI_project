const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const routertableManage = require('./routers/tableManage');
const routerLogin = require('./routers/login');
const routerLogout = require('./routers/logout');
const db = require('./db');


app.use(express.static(__dirname + '/scripts'));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'Caroline secret key',
    resave: false,
    saveUninitialized: true,
  })
);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/tableManage', routertableManage);
app.use('/login', routerLogin);
app.use('/logout', routerLogout);

app.get('/', (req, res) => {
  const isAdmin = req.session.isAdmin;
  if (isAdmin) {
    res.render('home', {
      databaseName: "pki_project_db",
      tableList: []
    });
  } else {
    res.redirect('/login');
  }
});

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

app.get('/tableColumns', (req, res) => {
  const tableColumns = {
    Users: ['', 'ID', 'FirstName', 'LastName', 'Email', 'Password', 'Nickname'],
    Posts: ['ID', 'User_ID', 'Title', 'Content', 'CreationDate']
  };

  res.json(tableColumns);
});

app.get('/tableContent', (req, res) => {
  const tableName = req.query.table;

  if (tableName === 'users') {
    db.any('SELECT * FROM Users')
      .then(data => {
        res.render('tableContentUsers', { tableName, tableData: data });
      })
      .catch(error => {
        console.error('Error retrieving table content:', error);
        res.status(500).send('An error occurred');
      });
  } else if (tableName === 'posts') {
    Promise.all([
      db.any('SELECT Posts.*, Users.FirstName FROM Posts JOIN Users ON Posts.User_ID = Users.ID'),
      db.any('SELECT ID, FirstName FROM Users')
    ])
      .then(([posts, users]) => {
        res.render('tableContentPosts', { tableName, tableData: posts, users: users });
      })
      .catch(error => {
        console.error('Error retrieving table content:', error);
        res.status(500).send('An error occurred');
      });
  } else {
    res.status(404).send('Table not found');
  }
});


app.post('/executeQuery', (req, res) => {
  const query = req.body.query;
  const sortColumn = req.body.sortColumn || '';
  const sortOrder = req.body.sortOrder || '';
  const filterColumn = req.body.filterColumn || '';
  const filterValue = req.body.filterValue || '';

  let modifiedQuery = query;

  if (filterColumn && filterValue) {
    modifiedQuery += ` WHERE ${filterColumn} LIKE '%${filterValue}%'`;
  }

  if (sortColumn && sortOrder) {
    modifiedQuery += ` ORDER BY ${sortColumn} ${sortOrder}`;
  }

  console.log(`modifiedQuery: ${modifiedQuery}`);

  db.query(modifiedQuery)
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
