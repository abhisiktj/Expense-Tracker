const CustomError=require('../middlewares/error');

const jwt=require('jsonwebtoken');
const User=require('../models/user');
const expressAsyncHandler=require('express-async-handler');
const statusCodes=require('http-status-codes');



const auth = expressAsyncHandler(async (req, res, next) => {
     
    const { authorization } = req.headers;
    if (!authorization || ! authorization.startsWith("Bearer")) {
      throw new CustomError("Authorization  Header Incorrect",statusCodes.BAD_REQUEST);
    }
      
        const token = authorization.split(" ")[1];
        try{
          
        const { userId } = jwt.verify(token, process.env.JWTSECRETKEY);
        req.user = await User.findById(userId).select('-password');
        if(!req.user){
          throw new CustomError(statusCodes.NOT_FOUND,"User Not Found");
        }
        next();
        }
        catch(error){
          throw new CustomError("Unauthorized",statusCodes.UNAUTHORIZED);
        }
  
    });
  
  module.exports=auth;