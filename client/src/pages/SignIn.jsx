import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function passwordToggle() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  const handleChange = (e) =>{
    setFormData({
      ...formData, 
      [e.target.id]: e.target.value,
    });
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    dispatch(signInFailure(''))
    try{
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      
      dispatch(signInSuccess(data));
      alert('Congratulations, you have signed in successfully. You will now be redirected to home page.');
      navigate('/');
    } catch(error){
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" name="email" id="email" placeholder='Email' className='border p-3 rounded-lg'  onChange={handleChange}/>

        <input type="password" name="password" id="password" placeholder='Password' className='border p-3 rounded-lg' onChange={handleChange}/>
          
        <div className='flex flex-row justify-start float-right'>
          <input type="checkbox" onClick={passwordToggle} /> &nbsp; Show Password
        </div>

        <button disabled={loading} id="signUp" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:placeholder-opacity-95 disabled:placeholder-opacity-80' onChange={handleChange}>
          {loading?'Loading':'Sign In'}
        </button>
        
        <OAuth />
        
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </form>

      <div className='flex flex-row justify-start gap-2 mt-5'>
        <p>
          New User?
        </p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign Up Here</span>
        </Link>
      </div>
    </div>
  )
}
