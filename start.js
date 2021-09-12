const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const router = express.Router();

app.use('/static', express.static('static'));
app.set('views', path.join(__dirname, 'views'));
//middleware
app.set('view engine','ejs');

app.get('/', (req, res)=>{
    res.render('index');
})

app.listen(port, ()=>{
    console.log(`the application is running at port http://localhost:${port}`);
});
