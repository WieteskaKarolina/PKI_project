# PKI_project
 Database contains two tables: Users and Posts.
 Project is a web service to manage the database for the site admin.
 
 ## Demo

 [link to deployed app](https://pki-project.onrender.com)
 
 ## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`
 
 ## Running App

To run app, run the following command

```bash
  node app.js
```

## Structure of pki_project_db
```
  CREATE TABLE Users (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Password VARCHAR(255),
    Nickname VARCHAR(255)
  );

  CREATE TABLE Posts (
    ID SERIAL PRIMARY KEY,
    User_ID INT REFERENCES Users(ID) ON DELETE CASCADE,
    Title VARCHAR(255),
    Content TEXT,
    CreationDate DATE
  );
```
## Authors

- [@WieteskaKarolina](https://github.com/WieteskaKarolina)
