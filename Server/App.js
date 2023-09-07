require("dotenv").config();
const express=require("express");
const cloudinary=require('cloudinary');

const connect=require('./config/db');

const userRouter=require('./routes/user');
const expenseRouter=require('./routes/expense');
const salaryRouter=require('./routes/salary');

const errorHandler=require('./middlewares/error');

const app=express();
app.use(express.json());

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUDNAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

app.use('/api/v1/user',userRouter);
app.use('/api/v1/expense',expenseRouter);
app.use('/api/v1/salary',salaryRouter);

app.use(errorHandler);

const port=process.env.port || 3000
const MONGO_URL=process.env.MONGO_URL;

const start=async()=>{
try{
     await connect(MONGO_URL);
     app.listen(port,()=>{
        console.log(`Server running on port ${port}`);
     })
}
catch(error){
    console.log(error);
}
}
start();