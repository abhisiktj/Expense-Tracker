const mongoose=require('mongoose');

const salarySchema=mongoose.Schema({

    amount:{
        type:Number,
        default:0,
    },
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    created:{
        type:Date,
        default:Date.now()
    },
    desc:{
        type:String,
        maxLength:50
    }
},{timestamps:true});

module.exports=mongoose.model('Salary',salarySchema);