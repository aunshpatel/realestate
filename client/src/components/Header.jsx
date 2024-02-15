import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() =>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md '>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-500'>Real</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
        </Link>
        {
          currentUser ? (
            <ul className='flex gap-4'>
              <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                <Link to={"/create-listing"}>
                  <li className='hidden sm:inline text-slate-700 hover:underline'>Create New Listing</li>
                </Link>
                <Link to={"/my-listing"}>
                  <li className='hidden sm:inline text-slate-700 hover:underline'>My Listings</li>
                </Link>
                <Link to={"/all-listings"}>
                  <li className='hidden sm:inline text-slate-700 hover:underline'>All Listings</li>
                </Link>
                <Link to='/profile'>
                  <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="Profile" />
                </Link>
            </ul>
          ):(
            <ul className='flex gap-4'>
                <Link to='/'>
                  <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                <Link to={"/all-listings"}>
                  <li className='hidden sm:inline text-slate-700 hover:underline'>All Listings</li>
                </Link>
                <Link to='/sign-in'>
                  <li className='text-slate-700 hover:underline'>Sign In</li>
                </Link>
            </ul>
          )
        }
      </div>
    </header>
  )
}
