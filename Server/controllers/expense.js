const expressAsyncHandler = require('express-async-handler');
const statusCodes=require('http-status-codes');

const CustomError=require('../utils/customError');
//importing models
const Expense=require('../models/expense');
const User=require('../models/user');

const mongoose = require('mongoose');



const addExpense=expressAsyncHandler(async (req,res)=>{

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
    const user=await User.findByIdAndUpdate(account,{$inc:{balance:-amount},$inc:{totalExpense:amount}},{new:true});

    const expense=await Expense.create({
          amount,
          account,
          created,
          desc
    })

    res.status(statusCodes.CREATED).json({
        success:true,
        data:{
            expense,
            user
        }
    });

})

const removeExpense=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id))
      throw new CustomError(statusCodes.BAD_REQUEST,"Invalid MONGO ID");

      const userId=req.user._id;
      let  expense=await Expense.findById(id);

      if(!expense){
        throw new CustomError(statusCodes.NOT_FOUND,"Expense Not Found")
      }

     

      if(String(expense.account)!==String(userId))
        throw new CustomError(statusCodes.UNAUTHORIZED,"Unauthorized Access");


      expense=await Expense.findByIdAndDelete(id);
      const amount=expense.amount;
      const user=await User.findByIdAndUpdate(userId,{$inc:{balance:amount},$inc:{totalExpense:-amount}},{new:true});

      res.status(200).json({
        success:true,
        data:{
            user
        }
      })
      
})

const getExpenseById=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id))
      throw new CustomError(statusCodes.BAD_REQUEST,"Invalid MONGO ID");

      const userId=req.user._id;
      const expense=await Expense.findById(id);

      if(!expense){
        throw new CustomError(statusCodes.NOT_FOUND,"Expense Not Found")
      }


      if(String(expense.account)!==String(userId))
        throw new CustomError(statusCodes.UNAUTHORIZED,"Unauthorized Access");


      res.status(200).json({
        success:true,
        data:{
            expense
        }
      })
      
})

const getAllExpenses=expressAsyncHandler(async(req,res)=>{

    const userId=req.user._id;
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 2;
    const skip=(page-1)*limit;
    
    const expenses=await Expense.find({account:userId}).sort({created:-1}).skip(skip).limit(limit);
      
    if(!expenses){
      throw new Error(statusCodes.NOT_FOUND,"No Expenses Available");
    }
    res.status(statusCodes.OK).json({success:true,data:{expenses}});
  
  })

module.exports={
    addExpense,
    removeExpense,
    getExpenseById,
    getAllExpenses
}

