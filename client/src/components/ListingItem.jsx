import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({listing}) {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[340px]'>
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt={`Cover Image of ${listing.name}`} className='h-[220px] sm:h-[320px] w-full object-cover hover:scale-105 transition-scale duration-300' />

                <div className='p-3 flex flex-col gap-2 w-full'>
                    <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
                    <div className='flex items-center gap-1'>
                        <MdLocationOn className='h-4 w-4 text-green-700'/>
                        <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>
                        {listing.description}
                    </p>
                    <p className='text-slate-500 mt-2 font-semibold flex flex-row gap-4 justify-between'>
                        <span>
                        {
                            listing.discount ? 
                                <span> 
                                    <span className='line-through'>$ {listing.regularPrice.toLocaleString('en-US')} </span> ${listing.discountPrice.toLocaleString('en-US')}
                                </span> : 
                                <span>
                                    $ {listing.regularPrice.toLocaleString('en-US')}
                                </span>
                        }
                        {listing.type === 'rent' && ' / month'}
                        </span>
                    </p>
                    <div className='text-slate-700 flex gap-4'>
                        <div className='font-semibold text-sm'>
                            {
                                listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` :  `${listing.bedrooms} bedroom`
                            }
                        </div>
                        <div className='font-semibold text-sm'>
                            {
                                listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` :  `${listing.bathrooms} bathroom`
                            }
                        </div>
                    </div>
                    <div>
                        <p className='bg-red-900 max-w-[150px] text-white text-center text-md p-2 rounded-md'>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                    </div>
                </div>
            </Link>

        </div>
    )
}
