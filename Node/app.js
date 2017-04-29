//  ____
// /\  _`\
// \ \ \/\ \    ___   _ __    ___ ___      __     __
//  \ \ \ \ \  / __`\/\`'__\/' __` __`\  /'__`\ /'__`\
//   \ \ \_\ \/\ \L\ \ \ \/ /\ \/\ \/\ \/\  __//\  __/
//    \ \____/\ \____/\ \_\ \ \_\ \_\ \_\ \____\ \____\
//     \/___/  \/___/  \/_/  \/_/\/_/\/_/\/____/\/____/
//

// Dependencies ================================================================
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const passport = require('passport');
const passportConfig = require('./config/passport');
const jwt = require('jsonwebtoken');

const path = require('path');

const config = require('./config/config');
const database = require('./config/database');
const expressMiddleware = require('./config/express');

// Express =====================================================================
// init app
let app = express();

// DB configuration ============================================================

// set connection to db
mongoose.connect(database.databaseURL);

// db connection test
mongoose.connection.on('connected', () => {
  console.log('Mongo says: Hello (^_^)');
});

// db error test
mongoose.connection.on('error', (err) => {
  console.log('Mongo says: Banana (-_-) \n' + err);
});

// Middleware ==================================================================
// Cors
app.use(cors());

// BodyParser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

// Morgan
app.use(morgan('dev'));

// Express Validator
let expressErrorFormatter = expressMiddleware.errorFormatter;
app.use(expressValidator({expressErrorFormatter}));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// initialize passport
passportConfig.passportJWT();
app.use(passport.initialize());


// allowing access to angular
// app.use(function(req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

// define routes ================================================================
const auth = require('./server/routes/auth.route');
const users = require('./server/routes/user.route');
const owners = require('./server/routes/owner.route');
const admins = require('./server/routes/admin.route');
const students = require('./server/routes/student.route');
const rentables = require('./server/routes/rentable.route');
const flatshares = require('./server/routes/flatshare.route');
const rentRequests = require('./server/routes/rentRequest.route');
const transactions = require('./server/routes/transaction.route');

// setting routes ===============================================================
app.use('/auth', auth);
app.use('/users', users);
app.use('/owners', owners);
app.use('/admins', admins);
app.use('/students', students);
app.use('/rentables', rentables);
app.use('/flatshares', flatshares);
app.use('/rentRequest', rentRequests);
app.use('/transactions', transactions);

// Health Check API ============================================================
app.get('/', (req, res) =>
  res.json({status: 'ok'})
);

// Start Server ================================================================
app.listen(config.port, () => {
  console.log('Node says: I\'m online @ ' + config.port);
});
