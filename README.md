# PKI_project
 Database contains two tables: Users and Posts.
 Project is a web service to manage the database for the site admin.
 
## Deployment

My Awesome App has been deployed on Render.com, a powerful and user-friendly cloud platform for hosting applications. 
It offers a seamless deployment experience and ensures high availability of our app.
To access the deployed application, visit [this page](https://pki-project.onrender.com). 

 
 ## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`
 
 ## Running App

To run app, run the following command

```bash
  node app.js
```

## Database

The application uses a PostgreSQL database hosted at Render.com. It provides a reliable and scalable solution for storing and managing our data.

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
