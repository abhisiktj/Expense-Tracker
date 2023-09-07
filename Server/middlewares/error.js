const CustomError=require('../utils/customError');

const errorHandler=async(error,req,res,next)=>{
        if(error instanceof CustomError){
            res.status(error.statusCode).json({success:false,message:error.message});
        }
}

module.exports=errorHandler;
