const cookieParser = require('cookie-parser');
const express=require('express');
require('dotenv').config();
const app=express();
const fileUpload=require('express-fileupload');
const Connection = require('./controllers/db');
const cloudinary=require('cloudinary')
const user=require('./routes/user');

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

//Internal Routes
app.use('/api/v1',user);
//Mongo Configuration
Connection();
//Cloudinary configuration
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running at Port ${process.env.PORT}`)
})