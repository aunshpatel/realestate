import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>{
    setFormData({
      ...formData, 
      [e.target.id]: e.target.value,
    });
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if(data.success === false){
        const message = JSON.stringify(data.message);
        if (message.includes("username_1") ){
          setError("Username already exists. Please enter another username.");
        }
        else{
          setError("Email ID already exists. Please enter another email ID or login using the existing id.");
        }
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      alert('Congratulations, you have signed up successfully. You will now be redirected to login page.');
      navigate('/sign-in');

    } catch(error){
      setLoading(false);
      setError(null);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" name="username" id="username" placeholder='Username' className='border p-3 rounded-lg' onChange={handleChange}/>

        <input type="email" name="email" id="email" placeholder='Email' className='border p-3 rounded-lg'  onChange={handleChange}/>

        <input type="password" name="password" id="password" placeholder='Password' className='border p-3 rounded-lg' onChange={handleChange}/>

        <button disabled={loading} id="signUp" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:placeholder-opacity-95 disabled:placeholder-opacity-80' onChange={handleChange}>
          {loading?'Loading':'Sign Up'}
          {/* Sign Up */}
        </button>
        <OAuth />
        
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </form>

      <div className='flex gap-2 mt-5'>
        <p>
          Have an account?
        </p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
