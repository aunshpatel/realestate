import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>{
    setFormData({
      ...formData, 
      [e.target.id]: e.target.value,
    });
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      // setLoading(true);
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
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message));
        // setError('Wrong email id and/or password. Please check and enter the correct values.');
        return;
      }
      // setLoading(false);
      // setError(null);
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
        <input type="email" name="email" id="email" placeholder='email' className='border p-3 rounded-lg'  onChange={handleChange}/>

        <input type="password" name="password" id="password" placeholder='password' className='border p-3 rounded-lg' onChange={handleChange}/>

        <button disabled={loading} id="signUp" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:placeholder-opacity-95 disabled:placeholder-opacity-80' onChange={handleChange}>
          {loading?'Loading':'Sign In'}
        </button>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </form>

      <div className='flex gap-2 mt-5'>
        <p>
          New Here?
        </p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign Up Here</span>
        </Link>
      </div>
    </div>
  )
}
