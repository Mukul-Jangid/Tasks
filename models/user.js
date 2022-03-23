const bcrypt=require('bcrypt');
const mongoose=require('mongoose')
const { Schema } = mongoose;
const validator=require('validator')
const jwt=require('jsonwebtoken');


const userSchema = new Schema({
    name:{
        type:String,
        required:[true,'Please Provide Name'],
        maxlength:[20,'Should not exceed 20 char'],
    },
    email:{
        type:String,
        required:[true,'Please provide Email'],
        unique:true,
        validate:[validator.isEmail,'Please Check email is correct or not']
    },
    password:{
        type:String,
        required:[true,'Please provide Password'],
        minlength:[6,'password should be of 6 character'],
        select:false //does not return password field in object         
    },
    role:{
        type:String,
        default:'user'
    },
    photo:{
        id:{
            type:String
        }
        ,secure_url:{
                type:String
        }
    }
    ,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

//encrypting before creating user
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
})


userSchema.methods.validatePassoword=async function(usersendpassword){
    return bcrypt.compare(usersendpassword,this.password);
}

userSchema.methods.getJwtToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{

        expiresIn: `${process.env.JWT_EXPIRY}` 
    });
}

module.exports=mongoose.model("User",userSchema);