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
      if(tableName === 'users'){
        res.render('tableContentUsers', { tableName, tableData: data });
      }
      else{
        res.render('tableContentPosts', { tableName, tableData: data });
      }
      
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


app.post('/api/users', (req, res) => {
  const newUser = req.body;
  db.one('INSERT INTO Users (firstname, lastname, email, password, nickname) VALUES ($1, $2, $3, $4, $5) RETURNING ID', [newUser.firstname, newUser.lastname, newUser.email, newUser.password, newUser.nickname])
    .then(result => {
      res.status(201).json({ id: result.ID });
    })
    .catch(error => {
      console.error('Error creating user:', error);
      res.status(500).send('An error occurred');
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

app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.oneOrNone('SELECT * FROM Users WHERE ID = $1', id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(error => {
      console.error('Error retrieving user:', error);
      res.status(500).send('An error occurred');
    });
});

app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.result('DELETE FROM Users WHERE ID = $1', id)
    .then(result => {
      if (result.rowCount === 1) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(error => {
      console.error('Error deleting user:', error);
      res.status(500).send('An error occurred');
    });
});
app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  db.result('UPDATE Users SET firstname = $1, lastname = $2, email = $3, password = $4, nickname = $5 WHERE ID = $6', [updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.password, updatedUser.nickname, id])
    .then(result => {
      if (result.rowCount === 1) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(error => {
      console.error('Error updating user:', error);
      res.status(500).send('An error occurred');
    });
});

// GET all posts
app.get('/api/posts', (req, res) => {
  db.any('SELECT * FROM Posts')
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      console.error('Error retrieving posts:', error);
      res.status(500).send('An error occurred');
    });
});

// GET a specific post by ID
app.get('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  db.one('SELECT * FROM Posts WHERE ID = $1', id)
    .then(post => {
      res.json(post);
    })
    .catch(error => {
      console.error('Error retrieving post:', error);
      res.status(500).send('An error occurred');
    });
});

// POST a new post
app.post('/api/posts', (req, res) => {
  const newPost = req.body;
  db.one('INSERT INTO Posts (User_ID, Title, Content, CreationDate) VALUES ($1, $2, $3, $4) RETURNING ID', [newPost.author, newPost.title, newPost.content, newPost.date])
    .then(result => {
      res.status(201).json({ id: result.ID });
    })
    .catch(error => {
      console.error('Error creating post:', error);
      res.status(500).send('An error occurred');
    });
});

// PUT (update) an existing post
app.put('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  const updatedPost = req.body;
  db.result('UPDATE Posts SET User_ID = $1, Title = $2, Content = $3, CreationDate = $4 WHERE ID = $5', [updatedPost.author, updatedPost.title, updatedPost.content, updatedPost.date, id])
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

// DELETE a post
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

      
app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
});
