const express = require('express'); 
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const newUser = require('./users');

//Routes fra dashboard til de andre subsider + beskyttelse
//Kunne have benyttet mig af JWT-tokens, men dette er nemmere
router.get('/swipe', ensureAuthenticated, (req, res) => 
    res.render('swipe', {
        name: req.user.name
})); 
router.get('/matches', ensureAuthenticated, (req, res) => 
    res.render('matches', {
        name: req.user.name
})); 
router.get('/profile', ensureAuthenticated, (req, res) => 
    res.render('profile', {
        name: req.user.name
    }));
router.get('/Home', ensureAuthenticated, (req, res) => 
    res.send('dashboard', {
        name: req.user.name
    }));



module.exports = router;