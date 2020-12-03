// Should be able to export this and add this as middleware
// We can add this to any route we need to be protected
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next(); 
        }
        req.flash('error_msg', 'You need to log in, biiissch'); 
        res.redirect('/users/login');
    }
}