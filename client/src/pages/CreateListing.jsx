import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create A Listing</h1>
        <form className='flex flex-col sm:flex-row gap-6'>
            <div className='flex flex-col gap-4 flex-1'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' id='name' placeholder='Name' className='border p-3 rounded-lg' maxLength={62} minLength={3} required />
                    <textarea type='text' id='description' placeholder='Description' className='border p-3 rounded-lg' required />
                    <input type='text' id='address' placeholder='Address' className='border p-3 rounded-lg' required />
                </div>
                <div className='flex gap-6 flex-wrap my-7'>
                    <div className='flex gap-2'> 
                        <input type='checkbox' id='sell' className='w-5' />
                        <span>Sell</span> 
                    </div>
                    <div className='flex gap-2'> 
                        <input type='checkbox' id='rent' className='w-5' />
                        <span>Rent</span> 
                    </div>
                    <div className='flex gap-2'> 
                        <input type='checkbox' id='parking' className='w-5' />
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'> 
                        <input type='checkbox' id='furnished' className='w-5' />
                        <span>Furnished</span> 
                    </div>
                    <div className='flex gap-2'> 
                        <input type='checkbox' id='offer' className='w-5' /> 
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min='1' max='100' className='p-2 border border-gray-300 rounded-lg' required />
                        <p>Bedrooms</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type='number' id='bathrooms' min='1' max='100' className='p-2 border border-gray-300 rounded-lg' required />
                        <p>Bathrooms</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' min='1' max="1000000000" className='p-2 border border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-xs'>($ per month)</span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type='number' id='discountPrice' min='1' max="1000000000" className='p-2 border border-gray-300 rounded-lg'/>
                        <div>
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                <span className='text-xs'>($ per month)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4 flex-1'>
                <p className='font-semibild'>
                    Images:
                    <span className='font-normal text-gray-600 ml-2'>First image will be cover (max 6 images)</span>
                </p>
                <div className='flex gap-4'>
                    <input className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='images/*, .heic' multiple />
                    <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                        Upload
                    </button>
                </div>
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 hover:placeholder-opacity-80'>
                    Create Listing
                </button>
            </div>
        </form>
    </main>
  )
}
