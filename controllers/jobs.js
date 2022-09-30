const Job=require("../models/Job");
const {StatusCodes}=require("http-status-codes");
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors");

const getJob=async(req,res)=>{
        
        const {userId}=req.user;
        const id=req.params.id;
        const job=await Job.find({createdBy:userId,_id:id});
        if(!job)
        {
            throw new NotFoundError(`No Job with ${id}`)
        }
        res.status(StatusCodes.OK).json({job});



}
const createJob=async(req,res)=>{

        const {userId}=req.user;
        req.body.createdBy=userId;
        const job=await Job.create(req.body);
        res.status(StatusCodes.CREATED).json({job});
}
const getAllJobs=async(req,res)=>{

    const {userId}=req.user;
    const jobs=await Job.find({createdBy:userId });
    res.status(StatusCodes.OK).json({jobs});


}
const updateJob=async(req,res)=>{
    
        const {id}=req.params;
        const {userId}=req.user;
        const {company,position}=req.body;
        if(!company|| !position)
        {
            throw new BadRequestError('Company or Position fields cannot be empty')
        }
        const updatedJob= await Job.findOneAndUpdate({_id:id,createdBy:userId},req.body,{
            new:true,
            runValidators:true
        });

        if(!updatedJob)
        {
            throw new NotFoundError(`No job with id ${id}`)
        }
        res.status(StatusCodes.CREATED).json({updatedJob});
        

}
const deleteJob=async(req,res)=>{
        const {id}=req.params;
        const deletedJob= await Job.findOneAndDelete({_id:id,createdBy});
        
        if(!deletedJob)
        {
            throw new NotFoundError(`No job with id ${id}`)
        }
        res.status(StatusCodes.CREATED).json({deletedJob});
        

}

module.exports={
    getJob,
    createJob,
    getAllJobs,
    updateJob,
    deleteJob
}