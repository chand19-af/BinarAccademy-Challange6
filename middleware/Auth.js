var Auth = {
    user_check : function (req, res, next){
        if (!req.session.logged_in) {
            return res.redirect('/login');
        } else{
            return res.redirect('/', {req});
        }
        next();
    },
};

module.exports = Auth;