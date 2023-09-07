import {useFormik} from 'formik';
import {Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {setToken} from '../utils/slices/authSlice'


const validate=(values)=>{
    let errors={};
  

    if(!values.username)
      errors.username="*Required"

    if(!values.password)
      errors.password="*Required"


    return errors;
}

const Login=()=>{
     const dispatch=useDispatch();
     const navigate=useNavigate();

    const formik=useFormik({
    initialValues:{
        username:"",
        password:"",
  
    },
    validate,
    onSubmit : async(values) =>{
     
      const url="/api/api/v1/user/login";
      const{username,password}=values;
      try{
      const response=await fetch(url,{
       method:"POST",
       body:JSON.stringify({
         username:username,
         password:password
       }),
       headers:{ 
         "Content-type": "application/json; charset=UTF-8"
        }
      })
      const json=await response.json();
        if(json.success==false){
         alert(json.msessage);
        }
        else{
         const data=json.data;
         const token=data.token;
         localStorage.setItem('token',token);
         dispatch(setToken({token}));
         alert("Logged In");
         navigate('/dashboard');
        }
     }
     catch(error){
          alert(error);
     }
}
})

return(
  <div className='flex flex-col items-center'>
    <div flex flex-col items-center>
  <p className='text-6xl mb-5'>SpendWise</p>
  <p className='text-3xl mb-2 text-center'>Login</p>
  <p className='text-2xl mb-2 text-center'>Do not have an account?<Link to="/auth/register"> Register </Link></p>
  </div>
   <form onSubmit={formik.handleSubmit} className=' flex flex-col items-center mt-3'>
       

      <div className='mt-1 p-3'>
      <label htmlFor="username" className='px-2'>Username</label>
       <input 
         id='username'
         name='username'
         type='text'
         className='bg-sky-100 p-1'
         value={formik.username}
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
      />  
      
      {formik.touched.username && formik.errors.username ?(
         <div className='text-xs text-red-700'>{formik.errors.username}</div>
      ) : null}
    </div>

    <div className='mt-1 p-3'>
      <label htmlFor="password" className='px-2'>Password</label>
       <input 
         id='password'
         name='password'
         type='password'
         className='bg-sky-100 p-1'
         value={formik.password}
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
      />  
      
      {formik.touched.password && formik.errors.password ?(
         <div className='text-xs text-red-700'>{formik.errors.password}</div>
      ) : null}
  
  </div>
 
      <button type='submit' className='bg-sky-300 p-2 border-2 border-blue-950 '>Submit</button>
    </form>
    </div>
)
}

export default Login;