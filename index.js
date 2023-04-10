const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./src/routes/routes');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const app = express();
const mongoString = `${process.env.DATABASE_URL}`; 
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database connected');
});


app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/public', express.static("./public"));
app.use(cors());
app.use(cookieParser());

app.use('/admin', routes);

app.listen(8000, () => {
    console.log('listening on 8000');
});