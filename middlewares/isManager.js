
exports.isManager=async(req,res,next)=>{
    if(req.user.role==="manager"){
        next();
    }
    else{
        res.status(400).json({
            error:"you are not an admin"
        })
    }
}