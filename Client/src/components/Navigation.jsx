import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../utils/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

import userContext from "../utils/contexts/userContext";
const map={
    '/dashboard':'Dashboard',
    '/profile':'Profile',
    '/salaries':'Salaries',
    '/expenses':'Expenses'
}
const links=Object.keys(map);


const Utilities=({url})=>{
  return(
    <li className="p-2 m-2"><Link to={`${url}`}>{map[url]}</Link></li>
  )
}



const Logout=()=>{
  
  const dispatch=useDispatch();
    const navigate=useNavigate();

  const handleLogout=()=>{
    dispatch(logout());
    localStorage.removeItem('token');
    alert("Logged out");
    navigate('/auth/login');
}
  return(
    <button onClick={handleLogout}>Logout</button>
  )
}

const Navigation=()=>{

  const {user,setUser}=useContext(userContext);
  const token=useSelector((store)=>store.auth.token)
  const getData=async(url)=>{
    try{
     const response=await fetch( url,{
      headers:{ 
        "Content-type": "application/json; charset=UTF-8",
        "authorization":`Bearer ${token}`
       }
     })
      const json=await response.json();
      const data=json.data;
      if(data.success==false)
        alert(data.message);
      setUser(data.user);
  }
  catch(error){
    console.log(error);
  }
}

    useEffect(()=>{
        const url=`/api/api/v1/user/getuserbyid`
        getData(url);
    },[])

    return(
        <div className="flex justify-between p-3 mb-2 bg-sky-200">
        <div className="flex flex-col justify-center items-center p-2">
            <img className="w-10 border-black border-2 rounded-full" src={user.profilephoto} alt="Not available" />
            <p>{user.name}</p>
        </div>
      <ul className="flex justify-between p-1">
          {links.map((element)=>{
               return <Utilities key={element} url ={`${element}`} />
              //{<li><Link to =`{${element}}`></Link></li>
          })}
      </ul>
      <Logout />
      </div>
    )
}
export default Navigation;



//add functionality of color of tab when clicked