import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>
                   Search Term: 
                </label>
                <input type="text" id='searchTerm' placeholder='Search Here' className='border rounded-lg p-3 w-full'/>
            </div>

            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Type:</label>
                <div className='flex gap-2'>
                    <input type="checkbox" id='all' className='w-5'/>
                    <span>Rent & Sell</span>
                    <input type="checkbox" id='rent' className='w-5'/>
                    <span>Rent</span>
                    <input type="checkbox" id='sell' className='w-5'/>
                    <span>Sell</span>
                    <input type="checkbox" id='discount' className='w-5'/>
                    <span>Discount Available</span>
                </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Amenities:</label>
                <div className='flex gap-2'>
                    <input type="checkbox" id='parking' className='w-5'/>
                    <span>Parking Lot</span>

                    <input type="checkbox" id='furnished' className='w-5'/>
                    <span>Furnished</span>
                    <input type="checkbox" id='semi-furnished' className='w-5'/>
                    <span>Semi Furnished</span>
                    <input type="checkbox" id='unfurnished' className='w-5'/>
                    <span>Unfurnished</span>
                    
                    
                    {/* <select name="" id="furnished">
                        <option value="">Furnished</option>
                        <option value="">Semi Furnishednished</option>
                        <option value="">Unfurnished</option>
                    </select> */}
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <label>Sort:</label>
                <select id="sort_order" className='border rounded-lg p-3'>
                    <option value="">Price: High to Low</option>
                    <option value="">Price: Low to High</option>
                    <option value="">Latest First</option>
                    <option value="">Oldest First</option>
                </select>
            </div>
            <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                Search
            </button>
        </form>
      </div>
      <div className=''>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results:</h1>
      </div>
    </div>
  )
}
