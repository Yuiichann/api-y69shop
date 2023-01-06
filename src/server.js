const express = require('express');
const config = require('./config/config');
const Logging = require('./library/Logging');
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const db = require('./db');

// connect db
db.connect();

// views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static path
app.use(express.static(__dirname + '/static'));

// Routes
app.use('/', routes);

// start app
app.listen(config.server.PORT, () =>
  Logging.success(`App start at PORT ${config.server.PORT}`)
);
