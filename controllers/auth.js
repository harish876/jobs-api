const User=require("../models/User");
const jwt=require("jsonwebtoken");

const {StatusCodes}=require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const register=async(req,res)=>{
    try { 
        const user=await User.create({...req.body});
        const token=user.createToken();
        res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token});

    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST).json({"msg":error.message});
    }
    
}
const login=async(req,res)=>{

    const {email,password}=req.body;
    if(!email || !password)
    {
        throw new BadRequestError('please provide email and password');
    }
    const user=await User.findOne({email});
    if(!user)
    {
        throw new UnauthenticatedError('invalid credentials');
    }
    const isPasswordCorrect=await user.comparePassword(password)
    if(!isPasswordCorrect)
    {
        throw new UnauthenticatedError('invalid credentials');
    }
    const token=user.createToken();
    res.status(StatusCodes.OK).json({user:{name:user.name},token});
}

module.exports={
    register,
    login
}