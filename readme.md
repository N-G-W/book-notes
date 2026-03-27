# Book Notes

This is a simple website that uses Node, Express, Ejs, Postgres, along with the Open Library API, for keeping track of the books you have read, their review and notes.
<img width="800" height="auto" alt="preview of book notes" src="https://github.com/user-attachments/assets/b1ff544c-90ec-4d28-8f8b-ba7695802cf3" />

## Setup Instructions

1. Create a database with the specifications in the queries.sql and write the hostname, user, database, port and password in a .env file similar to this:

```
{
    "user": "USERNAME",
    "database": "DATABASE-NAME",
    "host": "HOSTNAME" ,
    "password": "PASSWORD" ,
    "port":PORT-NUMBER
}
```

2. Install the npm packages:

```
    npm install
```

3. Run the server:

```
    node index.js
    or,
    nodemon index.js
```

4. Check if the server is up at http://localhost:3000/ and enjoy.

## Note

Check if the database it up and running.
