const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'please provide the user name'],
        minLength:3,
        maxLength:50
    },
    email:{
        type:String,
        required:[true,'please provide the user email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please fill a valid email address'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'please provide the password'],
        minLength:6,

    }

});
//REGISTER=> user provides name/email/password -> we hash the password -> then we create a token for that user
//LOGIN=> user provides email/password -> retrive the user 
userSchema.pre('save',async function(next){

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
})
userSchema.methods.getName=function()
{
    return this.name;
}

userSchema.methods.createToken=function()
{
    return jwt.sign({
        userId:this._id,userName:this.name},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRY}
        );
}
userSchema.methods.comparePassword=async function(candidatePassword){

    const isMatch=bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}
module.exports=mongoose.model('User',userSchema);