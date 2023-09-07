import { useFormik } from "formik";
import { useState,useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import ExpenseCard from "./ExpenseCard";


import expenseContext from "../utils/contexts/expenseContext";



const validate=(values)=>{
    let errors={}
        
    if(!values.amount)
      errors.amount="*Required"

    if(!values.desc)
      errors.desc="*Required"

    if(!values.created)
      errors.created="*Required"
    
    if(values.desc.length>50)
      errors.desc="Description Should be of less than or equal to 50 characters"

    return errors
}

const ExpenseForm=()=>{
    const token=useSelector((store)=>store.auth.token);
    const formik=useFormik({
        initialValues:{
            amount:0,
            created:"",
            desc:""
        },
        validate,
        onSubmit:async(values)=>{
             const url="/api/api/v1/expense/addexpense"
             const{amount,created,desc}=values;
             try{
                const response=await fetch(url,{
                    method:"POST",
                    body:JSON.stringify({
                      amount:amount,
                      desc:desc,
                      created:created
                    }),
                    headers:{ 
                      "Content-type": "application/json; charset=UTF-8",
                      "authorization":`Bearer ${token}`
                     }
                   })
                const json=await response.json();
                if(json.success==false){
                    alert(json.message);
                }
                else{
                    window.location.reload();
                }
             }
             catch(error){
                alert(error);
             }
        }
    });
    return(
        <div className="flex flex-col justify-center items-center">
        <p className="text-3xl text-blue-900 p-2 m-1">Add an Expense</p>
         <form  className="flex flex-col justify-center items-center  border-2  border-blue-900"onSubmit={formik.handleSubmit}>
         
         <div className="p-2 m-2">
         <label className="p-1 m-1" htmlFor="amount">Enter Amount</label>
         <input 
           className="bg-blue-100 border-2 border-blue-700"
           id="amount"
           name="amount"
           type="number"
           value={formik.amount}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
         />
         </div>
         {formik.touched.amount && formik.errors.amount ?(
         <div className='text-xs text-red-700' >{formik.errors.desc}</div>
      ) : null}
      
         <div className="p-2 m-2 flex justify-center items-center">
       <label className="p-1 m-1 " htmlFor="desc" >Description</label> 
           <textarea 
           className="w-200 h-20  border-4 border-blue-800"
           id="desc"
           name="desc"
           rows="3"
           cols="60"
           value={formik.desc}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
         />   
         </div>
          {formik.touched.desc && formik.errors.desc ?(
         <div className='text-xs text-red-700' >{formik.errors.desc}</div>
      ) : null}
      
      <div className="p-2 m-2">
       <label className="p-1 m-1" htmlFor="created">Select Date</label>
       <input
            className="bg-blue-100 border-2 border-blue-700"
            id="created"
            name="created"
            type="date"
            value={formik.created}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
</div>    {formik.touched.created && formik.errors.created ?(
         <div className='text-xs text-red-700' >{formik.errors.desc}</div>
      ) : null}
      <div>
      <button className="bg-red-300 border-2 border-blue-900 p-2 m-2" type="reset">Reset</button>
     <button className="bg-blue-300 border-2 border-blue-900 p-2 m-2" type="submit">Submit</button>
     </div>
         </form>
         </div>
    )
}



const ExpenseList=()=>{

  const [page,setPage]=useState(1);
  const {expenses,setExpenses}=useContext(expenseContext);
  const token=useSelector((store)=>store.auth.token)

 
const handlePrev=()=>{
  if(page>0)
   setPage(page-1);
}

const handleNext=()=>{
  console.log(page+1);
  setPage(page+1);
}

  const getData=async (url)=>{
    try{
      const response=await fetch(url,{
       headers:{ 
          "Content-type": "application/json; charset=UTF-8",
          "authorization":`Bearer ${token}`
         }
      });
       const json=await response.json();
       if(json.success==false){
        alert(json.message)
       }
       else{
          const data=json.data;
          setExpenses(data.expenses);
          if(data.expenses.length==0)
            setPage(1);
       }
    }
    catch(error){
      console.log(error);
    }
  }

 

  useEffect(()=>{
    const url=`/api/api/v1/expense/getallexpenses/?limit=5&page=${page}/`
    getData(url);
  },[page])

  
    return( 
      <div className="flex flex-col justify-center items-center">
        <p className="text-6xl m-2">Expenses</p>
      <ul className="flex flex-col justify-center items-center">{expenses.map((expense)=>{
                return <ExpenseCard expense={expense} key={expense._id}/> 
        })}</ul>
        <div>
      {(page!=1)&&<button className="p-2 m-1 bg-green-500 border-2 border-green-900" onClick={handlePrev}>Prev</button>}
          <button className="p-2 m-1 bg-green-500 border-2 border-green-900" onClick={handleNext}>Next</button>
        </div>
        </div>
    )
}



const Expenses=()=>{
    return(
        <>
    <ExpenseForm />
    <ExpenseList/>
    </>
    )
}
export default Expenses;