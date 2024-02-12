import React from 'react'
import {Link} from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-5xl'>
          Find your next <span className='text-slate-500'>adobe</span> <br />
          with ease.
        </h1>
        <div className='text-color-400 text-xs sm:text-lg'>
          RealEstate will help you find your next home with comfort and ease. <br />
          There is a large range of properties to choose from.
        </div>

        <Link to={'/search'} className='text-xs sm:text-lg text-blue-800 font-bold hover:underline'>
          Let's get started!
        </Link>
      </div>

      {/* swiper */}


      {/* listing results for offer/sell/rent */}
    </div>
  )
}
