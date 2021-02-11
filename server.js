// Hovedkilde: https://www.youtube.com/watch?v=6FOq4cUdH8k&fbclid=IwAR3ejU5LA4hUnkyHbm4ml6NIfHdhqiS_0mxe-Nc1q8gSnGE4hcMOAxoYNPc&ab_channel=TraversyMedia
const express = require('express'); 
// Dette gør det muligt at benytte EJS
const expressLayouts = require('express-ejs-layouts'); 
// Dette er for at lave et schema
const mongoose = require('mongoose'); 
// For at flash og express-session virker 
// Så skal man lave en middleware for det
const flash = require('connect-flash');
const session = require('express-session');
// Passport er en godkendelses-middleware for node.js 
const passport = require('passport');


const server = express()

// Passport 
require('./Authentication/passport')(passport); 


// Database authentication
const db = require('./Authentication/Database').MongoURI;

// Forbinder til to mongoDB og heraf benyttes mongoose 
// Her skal man huske at tilføje "useUnifiedTopology: true"
// Indeni tuborgklammerne, ellers brokker den sig
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true}) 
    .then(() => console.log('Database is connected...'))
    .catch(err => console.log(err)); 

// EJS (Middleware)
server.use(expressLayouts); 
server.set('view engine', 'ejs'); 

// Bodyparser: Vi behøver ikke at hente bodyparser, da det er blevet en del af express
// Vi skal hente formen og få den connected til mongoDB
// Nu kan vi hente data fra vores form med request.body
server.use(express.urlencoded({ extended: false }))

// Express-session middleware
// Hvad der står i secret er ligegyldigt
server.use(session({
      secret: 'Hehe',
      resave: true,
      saveUninitialized: true
    }));

// Prøver at hente brugeren
/*server.use(function (req, res, next){
    res.locals.currentUser = req.session.userId;
    next();
    });*/

// Passport middleware.
// Kilde: http://www.passportjs.org/docs/authenticate/
server.use(passport.initialize());
server.use(passport.session());


// Middleware for connect flash: 
// Efter vi har lavet middleware'n for express-session og connect flash 
// Så skulle det være muligt at få adgang til request.flash
server.use(flash());

// Disse variabler kaldes for globale variabler 
// Da jeg benytter dem i dele af programmet 
// Og de er ikke, men KAN benyttes overalt 
server.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
});


// Ruterne
// Dette forbinder API'et 
server.use('/', require('./Controller/index'))
server.use('/users', require('./Controller/users'))
server.use('/homepage', require('./Controller/index'))


/*server.get('/profile', function(req, res){
    User.find({}, function(err, docs){
        if(err) res.send(err);
        else res.render(); 
    })
})*/

const PORT = process.env.PORT || 3500;

server.listen(PORT, console.log(`Server started on port ${PORT}`));