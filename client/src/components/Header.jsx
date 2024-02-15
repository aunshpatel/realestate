import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  useEffect(() =>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search]);

  return (
    // <header className='bg-slate-200 shadow-md '>
    //   <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
    //     <Link to="/">
    //         <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
    //             <span className='text-slate-500'>Real</span>
    //             <span className='text-slate-700'>Estate</span>
    //         </h1>
    //     </Link>
    //     {
    //       currentUser ? (
    //         <ul className='flex gap-4'>
    //           <Link to='/'>
    //             <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
    //             </Link>
    //             <Link to='/about'>
    //                 <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
    //             </Link>
    //             <Link to={"/create-listing"}>
    //               <li className='hidden sm:inline text-slate-700 hover:underline'>Create New Listing</li>
    //             </Link>
    //             <Link to={"/my-listing"}>
    //               <li className='hidden sm:inline text-slate-700 hover:underline'>My Listings</li>
    //             </Link>
    //             <Link to={"/all-listings"}>
    //               <li className='hidden sm:inline text-slate-700 hover:underline'>All Listings</li>
    //             </Link>
    //             <Link to='/profile'>
    //               <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="Profile" />
    //             </Link>
    //         </ul>
    //       ):(
    //         <ul className='flex gap-4'>
    //             <Link to='/'>
    //               <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
    //             </Link>
    //             <Link to='/about'>
    //                 <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
    //             </Link>
    //             <Link to={"/all-listings"}>
    //               <li className='hidden sm:inline text-slate-700 hover:underline'>All Listings</li>
    //             </Link>
    //             <Link to='/sign-in'>
    //               <li className='text-slate-700 hover:underline'>Sign In</li>
    //             </Link>
    //         </ul>
    //       )
    //     }
    //   </div>
    // </header>

    <div className="flex items-center justify-between bg-slate-200 p-4 shadow-md">
      <Link to="/">
        <h1 className='font-bold text-2xl flex flex-wrap'>
          <span className='text-slate-500'>Real</span>
          <span className='text-slate-700'>Estate</span>
        </h1>
      </Link>
      <nav>
        <section className="MOBILE-MENU flex lg:hidden">
          <div className="HAMBURGER-ICON space-y-2" onClick={() => setIsNavOpen((prev) => !prev)} >
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
          </div>

          <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
            <div className="absolute top-0 right-0 px-8 py-8" onClick={() => setIsNavOpen(false)} >
              <svg className="h-8 w-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            
            {
              currentUser ? (
                <ul className='flex flex-col items-center justify-between min-h-[250px] sm:text-lg'>
                    <Link to='/' className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                      <li className=''>Home</li>
                    </Link>
                    <Link to='/about' className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                        <li className=''>About</li>
                    </Link>
                    <Link to={"/create-listing"} className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                      <li className=''>Create New Listing</li>
                    </Link>
                    <Link to={"/my-listing"} className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                      <li className=''>My Listings</li>
                    </Link>
                    <Link to={"/all-listings"} className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                      <li className=''>All Listings</li>
                    </Link>
                    <Link to='/profile'>
                      <img className='rounded-full h-12 w-12 object-cover' src={currentUser.avatar} alt="Profile" onClick={() => setIsNavOpen(false)} />
                    </Link>
                </ul>
              ):(
                <ul className='flex flex-col gap-4 sm:text-lg'>
                    <Link to='/' className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                      <li>Home</li>
                    </Link>
                    <Link to='/about' className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                        <li>About</li>
                    </Link>
                    <Link to={"/all-listings"} className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                      <li>All Listings</li>
                    </Link>
                    <Link to='/sign-in' className="border-b border-gray-400 uppercase" onClick={() => setIsNavOpen(false)} >
                      <li>Sign In</li>
                    </Link>
                </ul>
              )
            }
          </div>
        </section>
        {
          currentUser ? (
            // <ul className='flex flex-col items-center justify-between min-h-[250px]'>
            <ul className='DESKTOP-MENU hidden space-x-8 lg:flex mx-10 sm:text-lg'>
                <Link to='/' className="border-b border-gray-400 uppercase">
                  <li className=''>Home</li>
                </Link>
                <Link to='/about' className="border-b border-gray-400 uppercase">
                    <li className=''>About</li>
                </Link>
                <Link to={"/create-listing"} className="border-b border-gray-400 uppercase">
                  <li className=''>Create New Listing</li>
                </Link>
                <Link to={"/my-listing"} className="border-b border-gray-400 uppercase">
                  <li className=''>My Listings</li>
                </Link>
                <Link to={"/all-listings"} className="border-b border-gray-400 uppercase">
                  <li className=''>All Listings</li>
                </Link>
                <Link to='/profile' className="">
                  <img className='rounded-full h-8 w-8 object-cover' src={currentUser.avatar} alt="Profile" />
                </Link>
            </ul>
          ):(
            <ul className='DESKTOP-MENU hidden space-x-8 lg:flex mx-10 sm:text-lg'>
                <Link to='/' className="border-b border-gray-400 uppercase">
                  <li>Home</li>
                </Link>
                <Link to='/about' className="border-b border-gray-400 uppercase">
                    <li>About</li>
                </Link>
                <Link to={"/all-listings"} className="border-b border-gray-400 uppercase">
                  <li>All Listings</li>
                </Link>
                <Link to='/sign-in' className="border-b border-gray-400 uppercase">
                  <li>Sign In</li>
                </Link>
            </ul>
          )
        }
      </nav>
      <style>
      {`
        .hideMenuNav {
          display: none;
        }
        .showMenuNav {
          display: block;
          position: absolute;
          width: 100%;
          height: 100vh;
          top: 0;
          left: 0;
          background: white;
          z-index: 12;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        }
    ` }
      </style>
    </div>
  )
}
