import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";




const Protected=({Component})=>{
    const navigate=useNavigate();
    const token=useSelector((store)=>store.auth.token);
    
    useEffect(()=>{
        if(!token){
          navigate('/home');
        }
    })

    return(
        <>
    <Component />
      </>
    )
}

export default Protected;