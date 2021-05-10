const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const colors = require('colors');

const route = require('./routes');
const db = require('./config/db');

// Connect to DB
db.connect();

const app = express();
const port = 3030;

// Lookup folder public
app.use(express.static(path.join(__dirname, 'public')));

// Config middleware method post
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// Method Override
app.use(methodOverride('_method'));

// Template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route init
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
