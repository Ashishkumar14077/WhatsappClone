const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/whatsappusers",{ 
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`Connection Successful`);
}).catch((e)=>{
    console.log(`No Connection`);
})