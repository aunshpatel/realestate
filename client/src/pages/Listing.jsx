import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaMapMarkerAlt, FaShare, FaParking, FaChair } from 'react-icons/fa';
import Contact from '../components/Contact';
import { Link, useNavigate } from 'react-router-dom';
import { ref, getStorage, deleteObject } from 'firebase/storage';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const navigate = useNavigate();
    const {currentUser} = useSelector((state) => state.user);
    const [contact, setContact] = useState(false);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();

    useEffect(() =>{
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false){
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setLoading(false);
                setError(true);
            }
        };

        fetchListing();
    }, [params.listingId]);
    
    const handleListingDelete = async(listingID) => {
        try {
            const userData = await fetch(`/api/user/listings/${currentUser._id}`);
            const userDataJson = await userData.json();
            const storage = getStorage();

            const listingData = await fetch(`/api/listing/get/${listingID}`);
            const listingDataJson = await listingData.json();
            for(let i=0;i<listingDataJson.imageUrls.length;i++){
                const imageName = listingDataJson.imageUrls.at(i);
                const desertRef = ref(storage, imageName);
                deleteObject(desertRef).then(() => {
                    console.log("Image Removed Successfully")
                }).catch((error) => {
                    console.log(error)
                });
            }

            const res = await fetch(`/api/listing/delete/${listingID}`, {
                method:'DELETE'
            });

            const data = await res.json();
            if(data.success === false) {
                console.log(data.message);
                return;
            }
            navigate('/my-listing');

        } catch (error) {
            console.log(error.message);
        }
    }

    return (<main>
        { loading && <p className='text-center my-7 text-2xl'>Loading....</p> }
        { error && <p className='text-red-700 text-center my-7 text-2xl'>Something Went Wrong!</p> }

        {
            listing && !loading && !error && 
            <div>
                <Swiper navigation>
                    {
                        listing.imageUrls.map((url) => (
                            <swiper-container className='max-w-[800px] h-[600px]'>
                                <SwiperSlide key={url}>
                                    <div className='h-[550px]' style={{background:`url(${url}) center no-repeat`, backgroundSize:'contain' }}></div>
                                </SwiperSlide>
                            </swiper-container>
                        ))
                    }
                </Swiper>
                
                <div className='flex flex-col max-w-4xl mx-auto p-1 my-7 gap-6'>
                    <div className='flex gap-4'>
                        <button className='bg-slate-500 w-full max-w-[140px] text-white text-center p-2 rounded-md' onClick = {() =>{
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 5000);
                        }}>
                            Click Here To Share Listing
                        </button>
                        { copied && ( <p className='z-10 rounded-md bg-slate-100 p-2'>Link Copied! You Can Now Paste At Your Desired Place!</p> ) }
                    </div>
                    
                    <p className='text-2xl'>
                        <span className=' font-semibold'>{listing.name} </span> - {
                            listing.discount ? 
                            <span>
                                <span style={{textDecoration: 'line-through'}}>{listing.selectedCurrency.split(' - ')[0]} {listing.regularPrice.toLocaleString('en-US')}</span> &nbsp;
                                {listing.selectedCurrency.split(' - ')[0]} {listing.discountPrice.toLocaleString('en-US')}
                            </span> 
                            :
                            <span>{listing.selectedCurrency.split(' - ')[0]} {listing.regularPrice.toLocaleString('en-US')}</span>
                        } { listing.type === 'rent' && '/ month'}
                    </p>
                    <p className='text-slate-800 font-semibold'>
                        {listing.description}
                    </p>
                    <p className='items-center gap-2 text-slate-600 my-1 text-md'>
                        To view the address in maps, click on the below address:
                        <br />
                        <p className='flex items-center gap-2'>
                            <FaMapMarkerAlt className='text-green-700'/>
                            <a className='underline' href={`http://maps.google.com/?q=${listing.address}`} target="_blank">
                                {listing.address}
                            </a>
                        </p>
                    </p>
                    <div className='flex gap-4'>
                        {listing.type === 'rent' ? 
                            <p className='bg-slate-500 w-full max-w-[200px] text-white text-center p-2 rounded-md'>
                                For Rent
                            </p> : 
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-2 rounded-md'>
                                For Sale
                            </p>
                        }
                        {
                            listing.discount && (
                                <p className='bg-blue-600 w-ful max-w-[200px] text-white text-center p-2 rounded-md'>
                                    {listing.selectedCurrency.split(' - ')[0]} {(listing.regularPrice - listing.discountPrice).toLocaleString('en-US')} Discount
                                </p>
                            )
                        }
                    </div>
                    <ul className='flex flex-wrap items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm'>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaBed className='text-lg' /> {listing.bedrooms} {listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaBath className='text-lg' /> {listing.bathrooms} {listing.bedrooms > 1 ? 'Bathrooms' : 'Bathroom'}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaParking className='text-lg' /> {listing.parking} Car Parking
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaChair className='text-lg' /> {listing.furnished}
                        </li>
                    </ul>
                    {
                        currentUser && listing.userRef === currentUser._id && (
                            <div className='flex flex-wrap items-center gap-4 sm:gap-6'>
                                <button onClick={() => handleListingDelete(listing._id)} className='bg-red-900 w-full max-w-[200px] text-white text-center p-2 rounded-md uppercase'>
                                    Delete Listing
                                </button>
                                
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className='bg-green-900 w-[200px] text-white text-center p-2 rounded-md uppercase'>
                                        Edit Listing
                                    </button>
                                </Link>
                            </div>
                        )
                    }
                    {
                        currentUser && listing.userRef !== currentUser._id && !contact &&(
                            <button onClick={ () => setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                                {
                                    listing.type === 'rent' ? 'Contact Landlord' : 'Contact Owner'
                                }
                            </button>
                        )
                    }
                    {
                        contact && <Contact listing={listing} />
                    }
                    
                </div>
            </div>
        }
    </main>);
}
