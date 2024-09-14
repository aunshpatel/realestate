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
import { FaFlag } from 'react-icons/fa';

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
    const [open, setOpen] = useState(false);
    const [flagReason, setFlagReason] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        selectedCurrency:'',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        discount:false,
        isFlagged: false,
        flaggedReason:'',
        parking:0,
        furnished:'Furnished',
    });

    const handleOpen = () => {
        setOpen(true);
    };

    // Function to close the modal
    const handleClose = () => {
        setOpen(false);
    };

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

    // Handle flag submission
    const handleSubmit = async (listingID) =>{
        console.log("listingID:", listingID);
        
        try {
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${listingID}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    // ...formData,
                    isFlagged: true,
                    flaggedReason: flagReason,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);
            setFormData(data);
            if(data.success === false){
                setError(data.message)
            }
            alert('Listing flagged successfully! You will now be redirected to home page.');
            navigate('/');

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
    <main>
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
                    <div className='flex gap-4 justify-between'>
                        <div>
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
                        <div className="relative">
                            {/* Flag button */}
                            <button onClick={handleOpen} className="p-2 text-red-600 hover:text-red-800" aria-label="Flag Content">
                                <FaFlag size={24} />
                            </button>

                            {/* Modal for flagging content */}
                            {open && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                    <h2 className="text-lg font-bold mb-4">Report Inappropriate Content</h2>
                                    <p className="mb-4">Please select a reason for flagging this content:</p>

                                    <div className="mb-4">
                                        <label className="block mb-2">
                                            <input type="radio" name="reason" value="Spam" className="mr-2" onChange={(e) => setFlagReason(e.target.value)} />
                                            Spam
                                        </label>
                                        <label className="block mb-2">
                                            <input type="radio" name="reason" value="Offensive Language" className="mr-2" onChange={(e) => setFlagReason(e.target.value)} />
                                            Offensive Language
                                        </label>
                                        <label className="block mb-2">
                                            <input type="radio" name="reason" value="Hate Speech" className="mr-2" onChange={(e) => setFlagReason(e.target.value)} />
                                            Hate Speech
                                        </label>
                                        <label className="block">
                                            <input type="radio" name="reason" value="Other" className="mr-2" onChange={(e) => setFlagReason(e.target.value)} />
                                            Other
                                        </label>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                    <button onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                        Cancel
                                    </button>
                                    <button onClick={() => handleSubmit(listing._id)} disabled={!flagReason} className={`px-4 py-2 rounded text-white ${!flagReason ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`} >
                                        Submit
                                    </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Alert message */}
                        {showAlert && (
                            <div className="absolute top-0 right-0 mt-4 mr-4 p-4 bg-green-500 text-white rounded-lg shadow-lg">
                            Content flagged successfully!
                            </div>
                        )}
                        </div>
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
                            <div className='flex flex-wrap items-center gap-4 sm:gap-6 pb-20'>
                                <button onClick={() => handleListingDelete(listing._id)} className='bg-red-900 w-[50%] text-white text-center p-2 rounded-md uppercase hover:opacity-95'>
                                    Delete Listing
                                </button>
                                
                                <Link to={`/update-listing/${listing._id}`}  className='bg-green-900 w-[50%] text-white text-center p-2 rounded-md hover:opacity-95'>
                                    <button className='uppercase'>
                                        Edit Listing
                                    </button>
                                </Link>
                            </div>
                        )
                    }
                    {
                        currentUser && listing.userRef !== currentUser._id && !contact &&(
                            <div className='pb-20'>
                                <button onClick={ () => setContact(true)} className='bg-slate-700 w-full text-white rounded-lg uppercase hover:opacity-95 p-3'>
                                {
                                    listing.type === 'rent' ? 'Contact Landlord' : 'Contact Owner'
                                }
                                </button>
                            </div>
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
