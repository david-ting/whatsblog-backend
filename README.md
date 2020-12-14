# :rocket: whatsblog

The project has been published to heroku. It serves as the backend for [**whatsblog-frontend**](https://github.com/david-ting/whatsblog-frontend).

### Setup
It is a NodeJS server with Express framework. It has been connected to the Postgresl database for storing users, posts, comments and likes and dislikes data. Also, the Redis database has been used for the session management. 
Cloudinary API has also been integrated in this project for uploading the images sent by the frontend to cloundinary. 

#### Environmental variables
The .env file has to be created for running the codes properly.<br>
The following env variables have to be included in the file.<br>
* DB_CONNECTION (the url for connecting to the postgres database)
* REDIS_URL (the url for connecting to the redis database)
* CLITNE_ORIGIN, CLIENT_URL (for enabling CORS) 
* SESSION_SECRET (for signing the session ID cookie)
* CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (for connecting to the cloundinary API)
