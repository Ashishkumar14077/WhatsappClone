<<<<<<< HEAD
const express = require("express");
const path = require("path");
const app = express();
const port = 80;
const router = express.Router();

app.use('/static', express.static('static'));

//app.set('view-engine', 'html');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    //const params = {'title': 'whatsapp clone'};
    res.sendFile(path.join(__dirname+'/views/main.html'));
})

app.listen(port, ()=>{
    console.log(`the application is running at http://localhost:${port}`);
=======
require("dotenv").config()
const express = require("express");
const passport = require("passport");
const path = require("path");
const app = express();
require('./db/conn');
const Register = require("./models/register");
const port = process.env.PORT ||8080;
const router = express.Router();
const cookieSession = require("cookie-session");
const e = require("express");
require('./passport-setup');
app.use('/static', express.static('static'));

const static_path = path.join(__dirname, '/')

app.use(express.json());
app.use(express.urlencoded({extended : false}));

// google login
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
// create a new data base in our data base
app.post('/register', async(req, res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;

        if(password === cpassword){
            const registerUser = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                age: req.body.age,
                username: req.body.username,
                password:req.body.password ,
                confirmPassword:cpassword
            })
            const registered = await registerUser.save();
            res.status(201).render('signin',{name:req.body.firstname, username:req.body.username})
        }else{
            res.send("password are not matching");
        }
    }
    catch(e){
        res.status(400).send(e);
    }
})
// login validdation
app.post("/loginDB",async(req, res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;

        const user = await Register.findOne({username: username});
        if(user.password === password){
            res.status(201).render('main');
        }
    }catch(e){
        res.status(400).send("Invalid login Credentials");
    }
})
app.listen(port, ()=>{
    console.log(`the application is running at port http://localhost:${port}`);
>>>>>>> SIGNUP
});