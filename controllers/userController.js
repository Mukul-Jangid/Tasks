const CustomError = require('../CustomError');
const User =require('../models/user');
const cookietoken=require('../cookieToken');
const Cloudinary=require('cloudinary').v2

exports.signup= async (req,res,next)=>{
    try {
        let result;
        if(req.files){
            let file=req.files.photo
            result = await Cloudinary.uploader.upload(file.tempFilePath,{
                folder:'users',
                width:150,
                height:150,
                crop:"scale"
            })
        }

        const {email,name,password}=req.body;

    if(!email||!name||!password){
        return next(new CustomError("Name,Email and Password are required",400));
    }

    const user = await User.create({
        name,email,password,
        photo:{
            id:result.public_id,
            secure_url:result.secure_url
        }
    })
    
    console.log(user);
    //token generation 'Utility method
    cookietoken(user,res)
    } catch (error) {
        console.log(error);
    }
}

exports.login=async(req,res,next)=>{
    try {
        const {email,password}=req.body;

        if(!email||!password){
            next(new CustomError("Please Provide Email And password"),400);
        }

       const user= await User.findOne({
            email
        }).select('+password')//bcoz we have made password selection false by default

        if(!user){
            next(new CustomError("Account Does not exists"),400);
        }

        const passwordValidate= await user.validatePassoword(password);

        if(!user){
            next(new CustomError("Email And password does not match"),400);
        }

        cookietoken(user,res);

    } catch (error) {
        console.log(error);
    }
}

exports.logout=async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        Succes:true,
        message :"Logout Success"
    })
}


exports.getUserDetails=async(req,res,next)=>{
    const user= await User.findById(req.user.id);
    res.status(200).json({
        user
    });
}

exports.updatePassword=async(req,res,next)=>{
    const user= await User.findById(req.user.id).select("+password");

    const validation=await user.validatePassoword(req.body.oldPassword);
    if(!validation){
        res.status(400).json({
            error:"Password is Incorrect"
        })
    }

    user.password=req.body.password
    await user.save();
    cookietoken(user,res);
}

exports.updateUser=async (req,res,next)=>{
     const newData={
         name:req.body.name,
         email:req.body.email
     }

     if(req.files.photo){
         const user =await User.findById(req.user.id)
         const imageId=user.photo.id

         const resp=await Cloudinary.uploader.destroy(imageId);

         let file=req.files.photo
         result = await Cloudinary.uploader.upload(file.tempFilePath,{
             folder:'users',
             width:150,
             height:150,
             crop:"scale"
         })

         newData.photo={
             id:result.public_id,
             secure_url:result.secure_url
         }
     }



     const user=await User.findByIdAndUpdate(req.user.id,newData,{
         new: true,
         runValidators:true
     })
     res.status(200).json({
         success:true,
         user
     })
}

exports.adminUser=async (req,res)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })
}

exports.adminDelete=async(req,res)=>{
    const user=await User.findByIdAndDelete(req.body.userId);
    res.status(200).json({
        success:true,
        user,
        message:"User has been deleted"
    })
}

exports.managerUser=async(req,res)=>{
    const users=await User.find({role:"user"},"name");
    res.status(200).json({
        success:true,
        users
    })
}