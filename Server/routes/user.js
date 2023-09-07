const express=require('express');

const auth =require('../middlewares/authorization')
const {registerUser, loginUser, getUserById}=require('../controllers/user');
const router=express.Router();


router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/getuserbyid',auth,getUserById);


module.exports=router;

