import CanvasJSReact from '@canvasjs/react-charts';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

import { useContext, useEffect } from 'react';
import userContext from '../utils/contexts/userContext';
import expenseContext from '../utils/contexts/expenseContext';
import salaryContext from "../utils/contexts/salaryContext";
import { useSelector } from 'react-redux';



const Graph=()=>{
    const {expenses,setExpenses}=useContext(expenseContext);
    const {salaries,setSalaries}=useContext(salaryContext);


    let arrE=expenses.map((expense)=>{
        return {y:expense.amount,label:expense.created.substring(0,10)}
    })

    let arrS=salaries.map((salary)=>{
        return {y:salary.amount,label:salary.created.substring(0,10)}
    })


    const optionsExpenses = {
        animationEnabled: true,	
        toolTip: {
            shared: true
        },
        data: [{
            type: "spline",
            name: "Expense",
            showInLegend: true,
            dataPoints:arrE
        },
    ]
    }
    const optionsSalaries = {
        animationEnabled: true,	
        toolTip: {
            shared: true
        },
        data: [{
            type: "spline",
            name: "Salary",
            showInLegend: true,
            dataPoints:arrS
        },
    ]
    }

    return (
		<div className='flex justify-between items-center m-1 p-2'>
		{(expenses.length>0)&&<CanvasJSChart options = {optionsExpenses} />}
		{(salaries.length>0)&&<CanvasJSChart options = {optionsSalaries} />}
		</div>
		);
}

const Card=({title,data})=>{

    return(
        <div className='bg-cyan-300 border-2 border-blue-800 w-96 m-1 p-2'>
            <p className='text-3xl '>{title}</p>
            <p>{data}</p>
        </div>
    )

}

const Dashboard=()=>{
   const {user,setUser}=useContext(userContext);
   const {expenses,setExpenses}=useContext(expenseContext);
   const {salaries,setSalaries}=useContext(salaryContext);
   const token=useSelector((store)=>store.auth.token);
   
   const getExpenseData=async (url)=>{
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
       }
    }
    catch(error){
      console.log(error);
    }
  }
  const getSalaryData=async (url)=>{
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
          if(data.salaries.length==0)
            setPage(1);
          setSalaries(data.salaries);
       }
    }
    catch(error){
      console.log(error);
    }
  }

   useEffect(()=>{
      const url1="/api/api/v1/expense/getallexpenses/?limit=5&page=1/";
      const url2="/api/api/v1/salary/getallsalaries/?limit=5&page=1/"
      getExpenseData(url1);
      getSalaryData(url2)
   },[])
    
    return(
        <>
        <Graph />
        <div className='flex justify-between items-center m-2 p-2'>
        <Card title={"Total Salary"} data={user.totalSalary} />
        <Card title={"Total Balance"} data={user.totalSalary-user.totalExpense} />
        <Card title={"Total Expense"} data={user.totalExpense} />
        </div>
        </>
    )
}
export default Dashboard;