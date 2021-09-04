require("dotenv").config()
const express = require("express");
const passport = require("passport");
const path = require("path");
const app = express();
const port = 8080;
const router = express.Router();
const cookieSession = require("cookie-session");
require('./passport-setup');

app.use('/static', express.static('static'));

app.use(cookieSession({
    name: 'user-session',
    keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
    if(req.user){
        next();
    } else{
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
//middleware
app.set('view engine','ejs');

app.get('/', (req, res)=>{
     res.render('signin');
})
app.get('/home',isLoggedIn, (req, res)=>{
    res.render('main',{name:req.user.displayName, pic:req.user.photos[0].value});
})

app.get('/sucess', (req, res)=>res.send('successfully login'));

app.get('/failed', (req, res)=>res.send('you failed to login'));
//app.get('/good',isLoggedIn, (req, res)=>res.send(`welcome mr ${req.user.displayName}!`));

//auth route
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  }
);

app.get('/logout', (req, res)=>{
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.get('/register', (req, res)=>{
    res.render('signup');
})

app.listen(port, ()=>{
    console.log(`the application is running at port http://localhost:${port}`);
});