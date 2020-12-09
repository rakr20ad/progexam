// Dette beskytter appen således, at man ikke 
// Kan skrive localhost:5000/dashboard 
// Også komme direkte ind på hjemmesiden uden log ind eller registrering 
// Dette kan man bruge alle de steder, hvor det er vigtigt at have dette
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next(); 
        }
        req.flash('error_msg', 'You need to log in, plz'); 
        res.redirect('/users/login');
    }
}