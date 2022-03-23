const jwt=require('jsonwebtoken');
const User = require('../models/user');

exports.isLogedIn=async(req,res,next)=>{
    const token=req.cookies.token||req.headers("Authorization").replace("Bearer","")

    if(!token){
        res.status(401).json({
            message:"Please Login first"
        })
    }
    const result=jwt.verify(token,process.env.JWT_SECRET);

    //adding user to req if we got one
    req.user= await User.findById(result.id)
    next();
}