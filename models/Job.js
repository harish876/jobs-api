const mongoose=require("mongoose");

const jobSchema=new mongoose.Schema({

    company:{
        type:String,
        required:[true,'please provide the company'],
        maxLength:30
    },
    position:{
        type:String,
        required:[true,'please provide the position'],
        maxLength:200
    },
    status:{
        type:String,
        enum:['accepted','declined','pending'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide user'],

    },
    },{timestamps:true})

module.exports=mongoose.model('Job',jobSchema);