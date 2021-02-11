
const localStrategy = require('passport-local').Strategy;
const mongoose =  require('mongoose'); 
const bcrypt = require('bcryptjs'); 

//Load User Model 
const User = require('../Model/User'); 

module.exports = (passport) => {
    passport.use(
        new localStrategy({ usernameField: 'username' }, (username, password, done) => {
            //match User 
            // I min app, så er username  
            // Derfor er ens username unikt ligesom ens email ville være
            User.findOne({ username: username })
            .then(user => {
                if(!user){
                    return done(null, false, { message: 'Username is not registered' });
                }

                //Match the password 
                // Her sørger vi for at begge passwords er ens 
                // Dette er ikke et krav, men viser lidt flair
                bcrypt.compare(password, user.password, (err, isMatch) =>{
                    if(err) throw err; 

                    if(isMatch){
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );
    // serialization og deserialization logik er baseret på appen 
    // Det tillader appen at vælge en tilpas objektmappe 
    // Så den er uforstyrret af authentication lageret 
    // En users ID er lagret og gendannet som req.user
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}

