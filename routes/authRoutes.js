const User = require('../models/User');
const passport = require('passport');

module.exports = app => {
  // ===== Login =======
  app.get('/login', function(req, res) {
    res.render('login', { message: req.flash('error') });
  });

  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/contacts',
      failureRedirect: '/login',
      failureFlash: true
    }),
    function(req, res) {}
  );

  // ===== Signup ======
  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.post('/signup', function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
      if (err) {
        return res.render('signup');
      }
      passport.authenticate('local')(req, res, function() {
        res.render('contacts/index');
      });
    });
  });

  // ====  logout =======
  app.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You are logged-out');
    res.redirect('/');
  });

  function isLoggedIn(req, res, next) {
    // if user is authenticated, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect to home
    res.redirect('/');
  }
};
