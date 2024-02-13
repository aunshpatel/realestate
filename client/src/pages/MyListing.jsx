import { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';

export default function MyListing() {
    const [listing, setListing] = useState(null);
    const [showListingsError, setShowListingsError] = useState(false);
    const {currentUser} = useSelector((state) => state.user);
    const [userListings, setUserListings] = useState([]);

    useEffect(() =>{
        const handleShowListings = async () => {
            try{ 
              setShowListingsError(false);
              const res = await fetch(`/api/user/listings/${currentUser._id}`);
              const data = await res.json();
              if(data.success === false){
                setShowListingsError(true);
                return;
              }
        
              setUserListings(data);
            } catch(error){
              setShowListingsError(true);
            }
          }
          handleShowListings();

        // 
    }, [currentUser._id]);

    const handleListingDelete = async(listingID) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingID}`, {
                method:'DELETE'
            });

            const data = await res.json();
            if(data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings( 
                (prev) => prev.filter((listing) => listing._id !== listingID)
            );

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        userListings.length > 0 ? (
            <div className='p-3 max-w-fit mx-auto'>
                <h1 className='text-3xl font-semibold text-center my-7'>
                    All Listings
                </h1>
                <p className='text-red-700 mt-5'>
                    {showListingsError ? 'Error showing listings!' : ''}
                </p>
                <table className='my-7'>
                    <thead>
                        <tr className='border p-3 flex items-center gap-4'>
                            <th className='w-10'>
                                Sr No.
                            </th>
                            <th className='w-20'>
                                Image
                            </th>
                            <th>
                                Title
                            </th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    {
                        userListings.map((listing, index) =>(
                        <tbody>
                            <tr key={listing._id} className='border p-3 flex items-center gap-4 hover:bg-gray-50'>
                                <td className='w-10 items-center flex flex-col'>
                                    {(index+1).toString()}
                                </td>
                                <td className='w-20'>
                                    <Link to={`/listing/${listing._id}`}>
                                        <img src={listing.imageUrls[0]} alt='Listing Cover Image' className='h-20 w-20 object-contain rounded-lg'/>
                                    </Link>
                                </td>
                                <td className='w-100'>
                                    <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                                        <p className='w-[240px] sm:w-[400px] truncate'>
                                            {listing.name}
                                        </p>
                                    </Link>
                                </td>
                                <td className='flex flex-col item-center'>
                                    <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>
                                        Delete
                                    </button>
                                    <Link to={`/update-listing/${listing._id}`}>
                                        <button className='text-green-700 uppercase'>
                                            Edit
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                        ))
                    }
                </table>
            </div>
        ) : 
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>You have no listings!</h1>
            <Link to='/create-listing'>
                <h2 className='text-2xl font-semibold text-center my-7 underline text-slate-600'>Click here to create a new listing</h2>
            </Link>
        </div>
    )
}
