const express = require('express'); 
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../Authentication/authMiddleware');
const User = require('../Model/User');
const newUser = require('./users');

//Routes fra dashboard til de andre subsider + beskyttelse
//Kunne have benyttet mig af JWT-tokens, men dette er nemmere
// Her bruger jeg "function" og ikke => for at vise at 
// det kan gøre på begge måder
router.get('/swipe', ensureAuthenticated, function(req, res){  
    res.render('swipe', {
        name: req.user.name
})}); 
router.get('/matches', ensureAuthenticated, function(req, res){  
    res.render('matches', {
        name: req.user.name
})}); 
router.get('/profile', ensureAuthenticated, function(req, res){  
    res.render('profile', {
        name: req.user.name
    })});
router.get('/Home', ensureAuthenticated, function(req, res){
    res.send('dashboard', {
        name: req.user.name
    })});



module.exports = router;