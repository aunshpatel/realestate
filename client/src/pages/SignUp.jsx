import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';
import { countryCode } from '../components/CountryCode';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countrycode, setCountryCode] = useState("");
  const navigate = useNavigate();

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

        <input type="text" name="fullname" id="fullname" placeholder='Full Name' className='border p-3 rounded-lg'  onChange={handleChange}/> 

        

        <div className='flex space-x-16'>
          <select className='w-2/5 border p-3 rounded-lg' id="countryCode" value={countrycode} onChange={(e) => { formData.countrycode = e.target.value; setCountryCode(e.target.value); }} animate={{ mount: { y: 0 }, unmount: { y: 25 } }} required>
              <option value="">Country Code</option>
              {countryCode.map(countryCode => (
              <option key={countryCode.name + " (" + countryCode.code + ")"} value={countryCode.name + " (" + countryCode.code + ")"}>
                  {countryCode.name + " (" + countryCode.code + ")"}
              </option>
              ))}
          </select>
          <input type="number" name="mobile" id="mobile" placeholder='Mobile Number' className='w-3/5 border p-3 rounded-lg'  onChange={handleChange}/>
        </div>

       

        <input type="email" name="email" id="email" placeholder='Email' className='border p-3 rounded-lg'  onChange={handleChange}/>

        <input type="password" name="password" id="password" placeholder='Password' className='border p-3 rounded-lg' onChange={handleChange}/>
          
          <div className='flex flex-row justify-center float-right'>
            <input type="checkbox" onClick={passwordToggle} /> &nbsp; Show Password
          </div>

        <button disabled={loading} id="signUp" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:placeholder-opacity-95 disabled:placeholder-opacity-80' onChange={handleChange}>
          {loading?'Loading':'Sign Up'}
          
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
