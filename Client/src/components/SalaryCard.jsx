import { useSelector } from "react-redux";

const SalaryCard=({salary})=>{

    const token=useSelector((store)=>store.auth.token);
    const handleDelete=async()=>{
      const result=confirm("Do you want to delete the salary")
        if(!result)
          return;
          const url=`/api/api/v1/salary/removesalary/${salary._id}`
          try{
        const response=await fetch(url,{
            method:"DELETE",
            headers:{ 
                "Content-type": "application/json; charset=UTF-8",
                "authorization":`Bearer ${token}`
               }
        })
        const json=await response.json();
        if(json.success==false)
          alert(json.message);
        
        window.location.reload();
    }
    catch(error){
        console.log(error);
    }
    }
    const {amount,desc,created}=salary;
    return(
        <div className="flex justify-around border-2 border-black m-2 p-3 w-[800]">
            <span>Amount:{amount}</span>
            <span>{desc}</span>
            <span>{created.substring(0,10)}</span>
            <button className="bg-red-700 text-white border-2 border-black p-2" onClick={handleDelete}>Delete</button>
        </div>
    )
}
export default SalaryCard;