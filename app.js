const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

app.use(bodyParser.urlencoded({ extended: false }));
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
      console.error('Error retrieving table content:', error);
      res.status(500).send('An error occurred');
    });
});

app.get('/', (req, res) => {
  res.render('home', {
    databaseName: "pki_project_db", 
    tableList: [] // Will be updated by asynchronous AJAX request
  });
});

app.post('/executeQuery', (req, res) => {
  const query = req.body.query;
  db.query(query)
    .then((result) => {
      res.json({ result: result });
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

app.get('/api/users', (req, res) => {
  db.any('SELECT * FROM Users')
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Error retrieving users:', error);
      res.status(500).send('An error occurred');
    });
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  db.one('INSERT INTO Users (FirstName, LastName, Email, Password, Nickname) VALUES ($1, $2, $3, $4, $5) RETURNING ID', [newUser.FirstName, newUser.LastName, newUser.Email, newUser.Password, newUser.Nickname])
    .then(result => {
      res.status(201).json({ id: result.ID });
    })
    .catch(error => {
      console.error('Error creating user:', error);
      res.status(500).send('An error occurred');
    });
});

app.get('/api/posts', (req, res) => {
  db.any('SELECT * FROM Posts')
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Error retrieving posts:', error);
      res.status(500).send('An error occurred');
    });
});

app.post('/api/posts', (req, res) => {
  const newPost = req.body;
  db.one('INSERT INTO Posts (User_ID, Title, Content, CreationDate) VALUES ($1, $2, $3, $4) RETURNING ID', [newPost.User_ID, newPost.Title, newPost.Content, newPost.CreationDate])
    .then(result => {
      res.status(201).json({ id: result.ID });
    })
  .catch(error => {
      console.error('Error creating post:', error);
      res.status(500).send('An error occurred');
    });
});
    
app.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    db.result('DELETE FROM Posts WHERE ID = $1', id)
    .then(result => {
    if (result.rowCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
    })
    .catch(error => {
      console.error('Error deleting post:', error);
      res.status(500).send('An error occurred');
    });
});
      
app.put('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const updatedPost = req.body;
    db.result('UPDATE Posts SET User_ID = $1, Title = $2, Content = $3, CreationDate = $4 WHERE ID = $5', [updatedPost.User_ID, updatedPost.Title, updatedPost.Content, updatedPost.CreationDate, id])
    .then(result => {
    if (result.rowCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
    })
    .catch(error => {
      console.error('Error updating post:', error);
      res.status(500).send('An error occurred');
    });
});
      
app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
});
