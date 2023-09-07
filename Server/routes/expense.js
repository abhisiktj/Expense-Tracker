const express=require('express');

const auth =require('../middlewares/authorization')

const router=express.Router();
const {addExpense,removeExpense,getExpenseById,getAllExpenses}=require('../controllers/expense')

router.post('/addexpense',auth,addExpense);
router.delete('/removeexpense/:id',auth,removeExpense);
router.get('/getexpensebyid/:id',auth,getExpenseById);
router.get('/getallexpenses',auth,getAllExpenses);


module.exports=router;


