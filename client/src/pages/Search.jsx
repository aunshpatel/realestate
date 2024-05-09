import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const [selectedValue, setSelectedValue] = useState('All'); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const [sidebarData, setSidebarData] = useState({
        searchTerm:'',
        type:'all',
        furnished:'All',
        discount:false,
        sort:'createdAt',
        order:'desc',
    });
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const searchTermFormUrl = urlParams.get('searchTerm');
        const typeFormUrl = urlParams.get('type');
        const furnishedFormUrl = urlParams.get('furnished');
        const discountFormUrl = urlParams.get('discount');
        const sortTermFormUrl = urlParams.get('sort');
        const orderFormUrl = urlParams.get('order');

        if(searchTermFormUrl || typeFormUrl || furnishedFormUrl || discountFormUrl || sortTermFormUrl || orderFormUrl) {
            setSidebarData({
                searchTerm: searchTermFormUrl || '',
                type: typeFormUrl || 'all',
                furnished: furnishedFormUrl || 'All',
                discount: discountFormUrl === 'true' ? true : false,
                sort: sortTermFormUrl || 'createdAt',
                order: orderFormUrl || 'desc',
            });
        }

        const fetchListings = async () =>{
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length > 8) {
                setShowMore(true);
            } else{
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        }

        fetchListings();
    },[location.search]);

    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sell'){
            setSidebarData({...sidebarData, type:e.target.id})
        }
        if(e.target.id === 'searchTerm') {
            setSidebarData({...sidebarData, searchTerm:e.target.value})
        }
        if(e.target.id === 'discount') {
            setSidebarData({...sidebarData, discount: e.target.checked || e.target.checked === true ? true : false})
        }
        if(e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({...sidebarData, sort, order});
        }

        if(e.target.id === 'furnishedDropdown') {
            const furnished = e.target.value;
            setSelectedValue(furnished);
            setSidebarData({...sidebarData, furnished:e.target.value});
        }
        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('discount', sidebarData.discount)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/all-listings?${searchQuery}`)
    }

    const onShowMoreClick = async() => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

    return (
        <div className='flex flex-col px-7'>
            <h1 className='text-3xl font-semibold rounded-md w-full text-center p-4 text-slate-700 mt-5'>All Listings</h1>
            <div className='flex flex-col md:flex-row md:max-h-[750px]'>
                <div className='py-7 px-4 h-fit md:w-[250px] border-2 rounded-lg'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                        <div className='flex items-center gap-2'>
                            <input type="text" id='searchTerm' value={sidebarData.searchTerm} onChange={handleChange} placeholder='Search Here' className='border rounded-lg p-3 w-full'/>
                        </div>

                        <div className='flex gap-2 flex-wrap items-center'>
                            <label className='font-semibold'>Type:</label>
                            <div className='flex flex-wrap gap-2'>
                                <div>
                                    <input type="checkbox" id='all' checked={sidebarData.type === 'all'} onChange={handleChange} className='w-5'/>
                                    <span>Rent & Sell</span>
                                </div>
                                <div>
                                    <input type="checkbox" id='rent' checked={sidebarData.type === 'rent'} onChange={handleChange} className='w-5'/>
                                    <span>Rent</span>
                                </div>
                                <div>
                                    <input type="checkbox" id='sell' checked={sidebarData.type === 'sell'} onChange={handleChange} className='w-5'/>
                                    <span>Sell</span>
                                </div>
                                <div>
                                    <input type="checkbox" id='discount' checked={sidebarData.discount} onChange={handleChange} className='w-5'/>
                                    <span>Discount Available</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-2 flex-wrap items-center'>
                            <label className='font-semibold'>Furnishing:</label>
                            <div className='flex gap-2'>
                                <select id="furnishedDropdown" value={selectedValue} onChange={handleChange} className='border rounded-lg p-3'>
                                    <option value="All">All Types</option>
                                    <option value="Furnished">Furnished</option>
                                    <option value="Semi-Furnished">Semi Furnished</option>
                                    <option value="Unfurnished">Unfurnished</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className='flex flex-wrap items-center gap-2'>
                            <label className='font-semibold'>Sort:</label>
                            <select id="sort_order" defaultValue={'createdAt_desc'} onChange={handleChange} className='border rounded-lg p-3'>
                                <option value="regularPrice_desc">Price: High to Low</option>
                                <option value="regularPrice_asc">Price: Low to High</option>
                                <option value="createdAt_desc">Newest First</option>
                                <option value="createdAt_asc">Oldest First</option>
                            </select>
                        </div>
                        <div className='flex flex-wrap items-center gap-2'>
                            <label className='font-semibold text-red-600 text-sm'>Please make sure to press the "Search" button to apply the filter(s)!</label>
                        </div>
                        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                            Search
                        </button>
                    </form>
                </div>
                
                <div className='py-2 md:p-4 flex flex-wrap gap-4 overflow-y-scroll w-[270px] md:w-max'>
                    { !loading && listings.length === 0 && ( 
                        <p className='text-xl text-color-slate-700 w-screen text-center'> No listing found! </p>
                    )}
                    { loading && ( <p className='text-xl text-color-slate-700 text-center w-full'>Loading...</p> )}
                    {
                        !loading && listings && listings.map((listing) => ( 
                            <ListingItem key={listing._id} listing={listing} />
                         ))
                    }
                    {
                        showMore && (
                            <button onClick={() => { onShowMoreClick() }} className='text-green-700 hover:underline p-7 text-center w-full'>
                                Show More
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
