const express = require('express');
const app = express();

require('dotenv').config();

const db = require('./config/db');

db.authenticate()
.then(()=>{
    db.sync()
    .then(() => console.log('Connected to Server Mysql'))
    .catch(error => console.log(error.message));
})
.catch((error)=>console.log(error.message))

const routes = require('./routes/index');

app.use('/', routes);

module.exports = app;