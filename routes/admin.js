var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash    = require('connect-flash');

var admin = require('../controller/admin');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/admin/monitor',
    failureRedirect : '/admin',
    failureFlash: true
}));

router.get('/monitor', isLoggedIn, admin.monitor);
router.get('/order', isLoggedIn, admin.order);
router.get('/order/:xmlName', isLoggedIn, admin.viewXML);
router.post('/order/color', isLoggedIn, admin.color);
//Change Password
router.post('/changePassword', isLoggedIn, admin.changePassword);
//Log out
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/admin');
})

//Middleware
function isLoggedIn(req, res, next){    
  if(req.isAuthenticated() && req.user.role == 'admin'){
      return next();
  }
  res.redirect('/admin');
}
module.exports = router;