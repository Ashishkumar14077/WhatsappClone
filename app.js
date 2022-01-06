require("dotenv").config()
//require('./db/conn');
const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const csrf = require("csurf");
const passport = require("passport");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const Register = require("./models/register");
const router = express.Router();
const e = require("express");
const port = process.env.PORT ||8080;
var admin = require("firebase-admin");
require('./passport-setup');
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatapp-ce0cf-default-rtdb.firebaseio.com"
});

const csrfMiddleware = csrf({ cookie: true });
const static_path = path.join(__dirname, '/')

app.use('/static', express.static('static'));

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use(express.static("static"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

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

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
//middleware
app.set('view engine','ejs');

app.engine("html", require("ejs").renderFile);



app.get('/', (req, res)=>{
     res.render('signin');
})
app.get('/home', (req, res)=>{
    const sessionCookie = req.cookies.session || "";

    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((userData) => {
        console.log("Logged in:", userData.email)
        res.render('main');
      })
      .catch((error) => {
        res.redirect("/");
      });
    //res.render('main',{name:req.user.displayName, pic:req.user.photos[0].value});
})
app.get('/homeG',isLoggedIn, (req, res)=>{
    res.render('main',{name:req.user.displayName, pic:req.user.photos[0].value});
})
// to debug
app.get('/sucess', (req, res)=>res.send('successfully login'));

app.get('/failed', (req, res)=>res.send('you failed to login'));
//app.get('/good',isLoggedIn, (req, res)=>res.send(`welcome mr ${req.user.displayName}!`));

//auth route
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/homeG');
  }
);

app.get('/logout', (req, res)=>{
    res.clearCookie("session");
    res.redirect("/");
    req.session = null;
    req.logout();
})


app.get('/register', (req, res)=>{
    res.render('signup');
})

app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
  
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
  
    admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          const options = { maxAge: expiresIn, httpOnly: true };
          res.cookie("session", sessionCookie, options);
          res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
          res.status(401).send("UNAUTHORIZED REQUEST!");
        }
      );
  });
//create a new data base in our data base
/*
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
*/
// login validdation
/*
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
*/
app.listen(port, ()=>{
    console.log(`the application is running at port http://localhost:${port}`);
});