const express = require('express'); 
const router = express.Router();
// Bcrypt benyttes til password validation
const bcrypt = require('bcryptjs');
const passport = require('passport');



//User model: det jeg snakker om i else statement
const User = require('../Model/User')

//Log ind side
router.get('/login', (req, res) => res.render('login')); 

//register side
router.get('/register', (req, res) => res.render('register')); 

//Register handle
//handling a post request
//Det gør vi sådan her, da vi har connected users til app.js
// via. server.use('/users', require('./routes/users'))
//Laver en const variabel, som trækker info fra req.body (fra objektet inde i variablen)
router.post('/register', (req, res) => {
    const { name, username, age, Gender, prefGender, password, password2 } = req.body; 
    let errors = []; 
    //console.log(req.body)

    /*Age: En metode vi prøvede for at validere alder. 
    Vi brugte min. og max. i ejs i stedet for. 
    if(age > 100 && age < 18){ 
        errors.push({ msg: 'You need to be an adult between the age of 18-99' })
    }*/

    //tjek om kravsfelterne er opfyldt. 
    // Her kunne man lave if statements til enhver af kravene
    // Men man kan sagtens have alle statements i en klamme
    // som er en hurtigere og mere effektiv måde
    if( !name || !username || !age || !Gender || !prefGender || !password || !password2){
        errors.push({ msg: 'Plz fill in all fields' })
    }

    //Tjek om passwords matcher 
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
            username, 
            Gender, 
            prefGender,
            password, 
            password2
        }); 
    }else {


//Måden mongoose virker er, at du laver en model som "user" også kalder man en metode
//Så kan man gemme, finde ved at findIDAndRemove fx 
//Derfor har vi modellen i toppen og efter man har lavet en model 
//Så skulle man kunne kalde på den efterfølgende
//bruger fx user.findOne og findbyID
        //Validationen er enten godtaget eller nedlagt
        User.findOne({ username: username })
        .then(user =>{
            if(user){
                //User exists
                errors.push({ msg: 'Username is already registered'})
                res.render('register',{
                    errors, 
                    name, 
                    username,
                    age,
                    Gender,
                    prefGender, 
                    password, 
                    password2
                }); 
            } else {
                //Vi kan lave users og få det i vores terminal,
                //men skal have det i vores database
                const newUser = new User({
                    name, 
                    username,
                    age,
                    Gender, 
                    prefGender, 
                    password
                }); 
                console.log(new User)
                //Hash password: 
                //Den krypterer det basically ens kodeord 
                //Som er en væsentlig del, så dem der er admin 
                //Eller styrer serveren kan logge ind og se 
                //Folks personlige oplysnigner, som er et brud på GDPR
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                       if(err) throw err; 
                       // set password to hashed
                       newUser.password = hash; 
                        //save new user
                       newUser.save()
                       .then(user => {
                        req.flash('success_msg', 'You are now registered, lets go!');
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
// Det her styrer log ind funktionen. 
// Og redirecter brugeren henholdsvis, hvis brugeren 
// Logger ind med sin respektive kode eller laver en fejl
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/homepage', 
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next); 
    }); 


// Logout handle (1:19:00 ish): logout er en indbygget funktion i express
// Dette gør det samme som log ind bare for log ud
router.get('/logout', (req, res) => {
    req.logOut(); 
    req.flash('success_msg', 'You are logged out, see you soon');
    res.redirect('/users/login');
});

// Henter jeg den bruger, som er logget ind! 
/*router.get('/user', ensureAuthenticated, function (req, res) {
    // req.user should be defined here because of the ensureAuth middleware
    var id = req.user.id;
  
    User.findOne({_id: id}, function (err, user) {
      if (err) return res.json(400, {message: `user ${id} not found.`});
  
      // make sure you omit sensitive user information 
      // on this object before sending it to the client.
      res.json(user);
    });
  });*/


//Delete user
// Denne funktion kan slette en bruger via postman 
// Uden held at få funktionen til at blive connected
// til delete my user NOW knappen
router.delete('/delete-user/:id', ((req, res, next) => {
    //var id = req.user.id;
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

router.put('/update-user/:id', ((req, res, next) => {
    //var id = req.user.id;
    User.findByIdAndUpdate(req.params.id, (error, data) => {
        if(error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
            req.flash('success_msg', 'You have successfully updated ur acc'); 
            res.redirect('users/profile')
        }
    })
}))

/*function deleteUser 
Andet forsøg på at få delete user til at fungere via en knap
router.delete('/profile/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findByIdAndRemove({
        _id: req.params.id
        })
        res.send(user)
    }catch (error){
        console.log(error)
        return res.sendStatus(500)
    }
})
*/

router.get('/profile', function(req, res){
    User.find({}, function(err, docs){
        if(err) res.send(err);
        else res.render(); 
    })
})



module.exports = router; 
//module.exports = deleteUser; 
