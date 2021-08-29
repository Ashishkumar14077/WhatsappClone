const express = require("express");
const path = require("path");
const app = express();
const port = 80;

app.use('/static', express.static('static'));

//app.set('view-engine', 'html');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    //const params = {'title': 'whatsapp clone'};
    res.sendFile('/Project/WhatsappClone/Express/views/main.html');
})

app.listen(port, ()=>{
    console.log(`the application is running at port ${port}`);
});