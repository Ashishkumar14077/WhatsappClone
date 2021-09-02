const express = require("express");
const path = require("path");
const app = express();
const port = process.env.port || 80;
const router = express.Router();

app.use('/static', express.static('static'));

//app.set('view-engine', 'html');

app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res)=>{
    //const params = {'title': 'whatsapp clone'};
   // res.render(path.join(__dirname+'/views/signin'));
    res.sendFile(path.join(__dirname+'/views/signin.html'));
})

app.get('/home', (req, res)=>{
    //const params = {'title': 'whatsapp clone'};
    res.sendFile(path.join(__dirname+'/views/main.html'));
})



app.listen(port, ()=>{
    console.log(`the application is running at port http://localhost:${port}`);
});