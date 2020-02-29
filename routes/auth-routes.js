const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login',(req,res)=>{
  res.render('login', {user: req.user});
});

// auth logout
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/')
});

// auth with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// callback route for google redirect
router.get('/google/redirect', passport.authenticate('google'), (req,res)=>{
  res.redirect('/projects');
});

// auth with github
router.get('/github', passport.authenticate('github', {
  scope: ['profile']
}));

// callback route for github redirect
router.get('/github/redirect', passport.authenticate('github'), (req,res)=>{
  res.redirect('/projects');
});


module.exports = router;
