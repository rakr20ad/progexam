const express = require('express'); 
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//connection to server. 
//res.render hvad vi gerne vil have til at stå på siden
//Welcome page
router.get('/', (req, res) => res.render('Welcome')); 

//Dashboard 
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        name: req.user.name
    }));


    
module.exports = router; 
