//Hovedkilde: https://www.youtube.com/watch?v=6FOq4cUdH8k&fbclid=IwAR3ejU5LA4hUnkyHbm4ml6NIfHdhqiS_0mxe-Nc1q8gSnGE4hcMOAxoYNPc&ab_channel=TraversyMedia
const express = require('express'); 
const expressLayouts = require('express-ejs-layouts'); 
const mongoose = require('mongoose'); 
//(53:00ish)
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//passport Config 
require('./config/passport')(passport); 


//DB config
const db = require('./config/keys').MongoURI;

//Connect to mongo 
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }) 
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err)); 

//EJS (Middleware)
app.use(expressLayouts); 
app.set('view engine', 'ejs'); 

// Bodyparser: Vi behøver ikke at hente bodyparser, da det er blevet en del af express
// Vi skal hente formen og få den connected til mongoDB
// Now we can get data from our form w. request.body
app.use(express.urlencoded({ extended: false }))

// Express-session middleware
app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    }));

/* Prøver at hente brugeren
app.use(function (req, res, next){
    res.locals.currentUser = req.session.userId;
    next();
    });*/

//Passport middleware.
//Kilde: http://www.passportjs.org/docs/authenticate/
//Right above "sessions"
app.use(passport.initialize());
app.use(passport.session());


//Middleware for connect flash: 
//After we've created middleware for express-session and connect flash
//We should have access to request.flash
app.use(flash());

//global variables 
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
});


//Routes 
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/dashboard', require('./routes/dashboard'))




const PORT = process.env.PORT || 3500; 

app.listen(PORT, console.log(`Server started on port ${PORT}`));