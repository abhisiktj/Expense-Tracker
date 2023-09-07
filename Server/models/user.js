const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name field is required"],
    
    },
    username:{
        type:String,
        required:[true,"Username field is required"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email field is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password field is required"],
    },
    profilephoto:{
        type:String,
        required:[true,"Profile photo"]
    },
    balance:{
        type:Number,
        default:0
    },
    totalSalary:{
        type:Number,
        default:0
    },
    totalExpense:{
        type:Number,
        default:0
    }

},{timestamps:true});


module.exports=mongoose.model("User",userSchema);
