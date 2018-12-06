const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('connect-flash');

require('./services/passport')(passport);

// configuration
mongoose.connect(keys.mongo_URI, { useNewUrlParser: true }).then(err => {
  if (err) console.log(err);
});

// Passport Config //
app.use(
  require('express-session')({
    secret: 'tim loves tacos',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// express setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(flash());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

require('./routes/authRoutes')(app);
require('./routes/indexRoutes')(app);
require('./routes/api/contactsRoutes')(app);
//
//require('./seed.js')();

let port = 3000;
app.listen(port, () => {
  console.log('server is up and running');
});
