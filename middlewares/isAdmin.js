
exports.isAdmin=async(req,res,next)=>{
    if(req.user.role==="admin"){
        next();
    }
    else{
        res.status(400).json({
            error:"you are not an admin"
        })
    }
}