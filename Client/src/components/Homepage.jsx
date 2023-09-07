import {Link} from 'react-router-dom';

const Homepage=()=>{
    return(
        <>
         <p>This is homepage</p>
         <Link to="/auth/login">Login</Link><br></br>
         <Link to="/auth/register">New user? Register</Link>
        </>
    )
}

export default Homepage;