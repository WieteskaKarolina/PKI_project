var express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

router.get('/columns/:table', (req, res) => {
    const tableName = req.params.table;
    db.any(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
    `, tableName)
      .then(columns => {
        res.json(columns);
      })
      .catch(error => {
        console.error('Error retrieving columns:', error);
        res.status(500).send('An error occurred');
      });
  });

//USERS
router.post('/users', (req, res) => {
    const newUser = req.body;
    const password = crypto.createHash('md5').update(newUser.password).digest('hex');

    db.one('INSERT INTO Users (firstname, lastname, email, password, nickname) VALUES ($1, $2, $3, $4, $5) RETURNING ID', [newUser.firstname, newUser.lastname, newUser.email, password, newUser.nickname])
      .then(result => {
        res.status(201).json({ id: result.ID });
      })
      .catch(error => {
        console.error('Error creating user:', error);
        res.status(500).send('An error occurred');
      });
  });
  
  router.get('/users', (req, res) => {
    db.any('SELECT * FROM Users')
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        console.error('Error retrieving users:', error);
        res.status(500).send('An error occurred');
      });
  });
  
  router.get('/users/:id', (req, res) => {
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
  
  router.delete('/users/:id', (req, res) => {
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

  router.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    const password = crypto.createHash('md5').update(updatedUser.password).digest('hex');

    db.result('UPDATE Users SET firstname = $1, lastname = $2, email = $3, password = $4, nickname = $5 WHERE ID = $6', [updatedUser.firstname, updatedUser.lastname, updatedUser.email, password, updatedUser.nickname, id])
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
  
  //POSTS
  router.get('/posts', (req, res) => {
    Promise.all([
      db.any('SELECT Posts.*, Users.FirstName FROM Posts JOIN Users ON Posts.User_ID = Users.ID'),
      db.any('SELECT ID, FirstName FROM Users')
    ])
      .then(([posts, users]) => {
        res.json({ posts: posts, users: users });
      })
      .catch(error => {
        console.error('Error retrieving table content:', error);
        res.status(500).send('An error occurred');
      });
  });
  
  
  router.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    db.one(`
      SELECT Posts.*, Users.FirstName
      FROM Posts
      JOIN Users ON Posts.User_ID = Users.ID
      WHERE Posts.ID = $1
    `, id)
      .then(post => {
        res.json(post);
      })
      .catch(error => {
        console.error('Error retrieving post:', error);
        res.status(500).send('An error occurred');
      });
  });
  
  router.post('/posts', (req, res) => {
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
  
  router.put('/posts/:id', (req, res) => {
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
  
  router.delete('/posts/:id', (req, res) => {
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

module.exports = router;