const express = require('express'); 
const router = express.Router();
// Her hentes authentication, da man skal beskytte appen 
// Så man ikke kan skrive /dashboard og komme ind  
const { ensureAuthenticated } = require('../Authentication/authMiddleware');

// Connection to server. 
// Res.render hvad vi gerne vil have til at stå på siden
// Welcome page
router.get('/', function(req, res){
    res.render('Welcome')
})
//Homepage 
router.get('/homepage', ensureAuthenticated, function(req, res){  
    res.render('homepage', {
        name: req.user.name
    })});

//Routes fra homepage til de andre subsider + beskyttelse
router.get('/likeDislike', ensureAuthenticated, function(req, res){  
    res.render('likeDislike', {
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
    res.send('homepage', {
        name: req.user.name
    })});
   
module.exports = router; 
