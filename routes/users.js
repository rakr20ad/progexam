const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
//Dette skal jeg bruge for at sletfunktionen virker


//User model: det jeg snakker om i else statement
const User = require('../models/User')

//Login page
router.get('/login', (req, res) => res.render('login')); 

//register page
router.get('/register', (req, res) => res.render('register')); 

//Register handle
//handling a post request
//Det gør vi sådan her, da vi har connected users til app.js
// via. app.use('/users', require('./routes/users'))
//Laver en const variabel, som trækker info fra req.body (fra objektet inde i variablen)
router.post('/register', (req, res) => {
    const { name, email, age, Gender, prefGender, password, password2 } = req.body; 
    let errors = []; 

    /*Age: En metode vi prøvede for at validere alder. 
    Vi brugte min. og max. i ejs i stedet for. 
    if(age > 100 && age < 18){ 
        errors.push({ msg: 'You need to be an adult between the age of 18-99' })
    }*/

    //check required fields
    if( !name || !email || !age || !Gender || !prefGender || !password || !password2){
        errors.push({ msg: 'Plz fill in all fields' })
    }

    //check passwords match 
    //Ikke et krav, men viser flair!
    if(password !== password2){
        errors.push({ msg: "Passwords are not identical" })
    }

    // Check password length
    if(password.length < 8){
        errors.push({ msg: 'Password needs more than 8 characters' })
    }
    //Vi gør dette, da hvis der er noget galt med 
    // nogle af info, så skal info ikke bare forsvinde
    //men vise hvor fejlen er (som jeg forstår det, eller se video omkring 34:29)
    // pga koden inde i register
    if(errors.length > 0){
        res.render('register',{
            errors, 
            name, 
            email, 
            Gender, 
            prefGender,
            password, 
            password2
        }); 
    }else {
//the way that mongoose works, 
//you create a model such as user and then u have methods
//that u can call that model, like save, find and things like that 
//therefore we need to make bring in our model in the top. 
//After I make the User model, I should be able to call the model
//For further explanation 42:00 min in the video
        //Validation passed
        User.findOne({ email: email })
        .then(user =>{
            if(user){
                //User exists
                errors.push({ msg: 'Email is already registered'})
                res.render('register',{
                    errors, 
                    name, 
                    email,
                    age,
                    Gender,
                    prefGender, 
                    password, 
                    password2
                }); 
            } else {
                //Gør det kortere: behøver ikke sige fx name: name
                //da vi allerede har gjort det
                //Vi kan lave users og få det i vores terminal,
                //men skal have det i vores database
                const newUser = new User({
                    name, 
                    email,
                    age,
                    Gender, 
                    prefGender, 
                    password
                }); 

                //Hash password: yderligere forklaring om funktionen (49:00)
                //Den krypterer det basically
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                       if(err) throw err; 
                       // set password to hashed
                       newUser.password = hash; 
                        //save new user
                       newUser.save()
                       .then(user => {
                           //bruger flash men mangler at display
                        req.flash('success_msg', 'You are now registered, lets fuck!');
                           res.redirect('/users/login');
                       })
                       .catch(err => console.log(err));
                }))
            }
        })
    }
}); 

//Login Handle (1:13:00 ish)
// Kilde: http://www.passportjs.org/docs/authenticate/
// cmd f "custom callback"
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard', 
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next); 
    }); 


//logout handle (1:19:00 ish): logout er en indbygget funktion i express
router.get('/logout', (req, res) => {
    req.logOut(); 
    req.flash('success_msg', 'You are logged out, see you soon');
    res.redirect('/users/login');
});

// Henter jeg den bruger, som er logget ind! 
router.get('/user', ensureAuthenticated, function (req, res) {
    // req.user should be defined here because of the ensureAuth middleware
    var id = req.user.id;
  
    User.findOne({_id: id}, function (err, user) {
      if (err) return res.json(400, {message: `user ${id} not found.`});
  
      // make sure you omit sensitive user information 
      // on this object before sending it to the client.
      res.json(user);
    });
  });

//Delete user
router.delete('/delete-user/:id', ((req, res, next) => {
    User.findByIdAndRemove(req.params.id, (error, data) => {
        if(error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
            req.flash('success_msg', 'You have successfully deleted ur acc'); 
            res.redirect('users/register')
        }
    })
}))




module.exports = router; 

