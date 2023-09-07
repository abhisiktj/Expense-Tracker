const expressAsyncHandler = require('express-async-handler');
const statusCodes=require('http-status-codes');


const CustomError=require('../utils/customError');
//importing models
const Salary=require('../models/salary');
const User=require('../models/user');

const mongoose = require('mongoose');

const addSalary=expressAsyncHandler(async (req,res)=>{

    const{amount,created,desc}=req.body;
    const account=req.user._id;

    if(!amount){
        throw new CustomError(statusCodes.BAD_REQUEST,"Amount field can not be empty");
    }
    if(!created){
        throw new CustomError(statusCodes.BAD_REQUEST,"Created field can not be empty");
    }
    if(!desc){
        throw new CustomError(statusCodes.BAD_REQUEST,"Desc field can not be empty");
    }
    const user=await User.findByIdAndUpdate(account,{$inc:{balance:amount},$inc:{totalSalary:amount}},{new:true});

    const salary=await Salary.create({
          amount,
          account,
          created,
          desc
    })

    res.status(statusCodes.CREATED).json({
        success:true,
        data:{
            salary,
            user
        }
    });

})

const removeSalary=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!id){
      throw new CustomError(statusCodes.NOT_FOUND,"Salary ID NOt Found")
    }

    if(!mongoose.Types.ObjectId.isValid(id))
      throw new CustomError(statusCodes.BAD_REQUEST,"Invalid MONGO ID");

      const userId=req.user._id;
      let  salary=await Salary.findById(id);

      if(!salary){
        throw new CustomError(statusCodes.NOT_FOUND,"Salary Not Found")
      }


      if(String(salary.account)!==String(userId))
        throw new CustomError(statusCodes.UNAUTHORIZED,"Unauthorized Access");


      salary=await Salary.findByIdAndDelete(id);
      const amount=salary.amount;
      const user=await User.findByIdAndUpdate(userId,{$inc:{balance:-amount},$inc:{totalSalary:-amount}},{new:true});

      res.status(200).json({
        success:true,
        data:{
            user
        }
      })
      
})

const getSalaryById=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id))
      throw new CustomError(statusCodes.BAD_REQUEST,"Invalid MONGO ID");

      const userId=req.user._id;
      const salary=await Salary.findById(id);

      if(!salary){
        throw new CustomError(statusCodes.NOT_FOUND,"Salary Not Found")
      }


      if(String(salary.account)!==String(userId))
        throw new CustomError(statusCodes.UNAUTHORIZED,"Unauthorized Access");


      res.status(200).json({
        success:true,
        data:{
            salary
        }
      })
      
})

const getAllSalaries=expressAsyncHandler(async(req,res)=>{

    const userId=req.user._id;

    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 2;
    const skip=(page-1)*limit;

    const salaries=await Salary.find({account:userId}).sort({created:-1}).skip(skip).limit(limit);
      
    if(!salaries){
      throw new Error(statusCodes.NOT_FOUND,"No Salaries Available");
    }
    res.status(statusCodes.OK).json({success:true,data:{salaries}});
  
  })

  
module.exports={
    addSalary,
    removeSalary,
    getSalaryById,
    getAllSalaries
}