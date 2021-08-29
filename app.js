const express = require("express");
const path = require("path");
const app = express();
const port = 80;

app.use('/static', express.static('static'));

app.set('view-engine', 'html');

app.set('views', path.join(__dirname, 'views'));

app.get("/", (res, req)=>{
    res.statusCode(200).render('main.html');
})

app.listen(port, ()=>{
    console.log(`the apllication is running at port ${port}`);
});