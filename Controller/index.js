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
//Dashboard 
router.get('/dashboard', ensureAuthenticated, function(req, res){  
    res.render('dashboard', {
        name: req.user.name
    })});


    
module.exports = router; 
