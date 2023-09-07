const express=require('express');

const auth =require('../middlewares/authorization')

const router=express.Router();
const {addSalary,removeSalary,getSalaryById,getAllSalaries}=require('../controllers/salary')

router.post('/addsalary',auth,addSalary);
router.delete('/removesalary/:id',auth,removeSalary);
router.get('/getsalarybyid/:id',auth,getSalaryById);
router.get('/getallsalaries',auth,getAllSalaries);


module.exports=router;