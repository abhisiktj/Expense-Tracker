//importing npm packages
const expressAsyncHandler=require('express-async-handler');
const statusCodes=require('http-status-codes');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cloudinary=require('cloudinary');
const fs = require("fs").promises;
const fs2 = require("fs");

//importing models
const User=require('../models/user'); 

//importing utils
const CustomError=require('../utils/customError');



const registerUser=expressAsyncHandler(async(req,res)=>{

    const {name,email,username,password}=req.body;

    if(!name){
        throw new CustomError(statusCodes.BAD_REQUEST,"Name Field Can not be empty");
    }
    if(!username){
        throw new CustomError(statusCodes.BAD_REQUEST,"Username Field Can not be empty");
    }
    if(!password){
        throw new CustomError(statusCodes.BAD_REQUEST,"Password Field Can not be empty");
    }
    const response = await fetch(
        `https://api.dicebear.com/6.x/pixel-art/png?seed=${username}`
      );
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(`./temp/${username}.png`, buffer);
     

  const result = await cloudinary.v2.uploader.upload(`./temp/${username}.png`, {
    folder: "Spendwise/Users",
    use_filename: true,
  });
 
  
  fs2.unlinkSync(`./temp/${username}.png`);
  const profilephoto = result.secure_url;

         const salting=await bcrypt.genSalt(10);
         const hashedPassword=await bcrypt.hash(password,salting);

         const user=await User.create({
            name,
            email,
            username,
            password:hashedPassword,
            profilephoto
         });

      

   const token=jwt.sign({
      userId:user._id,
   },process.env.JWTSECRETKEY,{expiresIn:'30d'});

     res.status(statusCodes.CREATED).json({
        success:true,
        data:{
            token
        }
     });
});


const loginUser=expressAsyncHandler(async(req,res)=>{
     const{username,password}=req.body;

     if(!username){
        throw new CustomError(statusCodes.BAD_REQUEST,"Username Field Can not be empty");
    }
    if(!password){
        throw new CustomError(statusCodes.BAD_REQUEST,"Password Field Can not be empty");
    }

    const user=await User.findOne({username});
    if(!user)
      throw new CustomError(statusCodes.UNAUTHORIZED,"Incorrect Username");
    
    const isMatched=bcrypt.compare(password,user?.password);

    if(!isMatched)
       throw new CustomError(statusCodes.UNAUTHORIZED,"Incorrect Password")
    
     const token=jwt.sign({
        id:user._id,
     },process.env.JWTSECRETKEY,{expiresIn:'30d'});

     res.status(statusCodes.OK).json({
        success:true,
        data:{
            token
        }
     });
});


const getUserById=expressAsyncHandler(async(req,res)=>{
    
    const id=req.user._id;
    if(!id){
        throw new CustomError(statusCodes.BAD_REQUEST,"User Id not available");
    }

    const user=await User.findById(id).select('-password');

    res.status(statusCodes.OK).json({
        success:true,
        data:{
            user
        }

    })

})

module.exports={registerUser,loginUser,getUserById};