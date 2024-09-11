import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [discountListings, setDiscountListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);
  console.log(discountListings);
  SwiperCore.use([Navigation]);

  
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?discount=true&limit=4')
        const data = await res.json();
        setDiscountListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sell&limit=4')
        const data = await res.json();
        setSellListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className='pb-20'>
      {/* top */}
      <div className='flex flex-col gap-6 p-40 px-3 max-w-6xl mx-auto'>
          {/* style={{background:`url(${"/src/assets/images/pexels-pixabay-221540.jpeg"}) center no-repeat`, backgroundSize:'100%'}}> */}
        <h1 className='text-slate-900 font-bold text-3xl lg:text-5xl'>
          Find your next <span className='text-slate-400'>humble adobe</span> <br />
          with ease.
        </h1>
        <div className='text-slate-800 text-md font-bold sm:text-lg'>
          RealEstate will help you find your next home with comfort and ease. <br />
          There is a large range of properties to choose from.
        </div>

        <Link to={'/all-listings'} className='text-sm sm:text-lg text-blue-800 font-bold hover:underline'>
          Let's get started!
        </Link>
      </div>
      {/* listing results for offer/sell/rent */}
      {/* swiper */}
      {/* Swiper for discounted price */}
      <Swiper navigation>
      {
        discountListings && discountListings.length > 0 && discountListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div className='h-[300px]' key={listing._id} style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}}>
            </div>
          </SwiperSlide>
        ))
      }
      </Swiper>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {discountListings && discountListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Properties Available At Discount
              </h2>
              <Link to='/all-listings?discount=true' className='text-sm text-blue-800 hover:underline'>
                Show More
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                discountListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}></ListingItem>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Swiper for rent*/}
      <Swiper navigation>
      {
        rentListings && rentListings.length > 0 && rentListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div className='h-[300px]' key={listing._id} style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}}>
            </div>
          </SwiperSlide>
        ))
      }
      </Swiper>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent Rental Properties
              </h2>
              <Link to='/all-listings?type=rent' className='text-sm text-blue-800 hover:underline'>
                Show More
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}></ListingItem>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Swiper for sale*/}
      <Swiper navigation>
      {
        sellListings && sellListings.length > 0 && sellListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div className='h-[300px]' key={listing._id} style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}}>
            </div>
          </SwiperSlide>
        ))
      }
      </Swiper>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {sellListings && sellListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent Properties For Sale
              </h2>
              <Link to='/all-listings?type=sell' className='text-sm text-blue-800 hover:underline'>
                Show More
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                sellListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}></ListingItem>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
