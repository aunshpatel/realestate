import {useSelector, useDispatch} from 'react-redux'
import React, { useRef, useState, useEffect } from 'react';
import heic2any from 'heic2any';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, updateUserFailure, updateUserStart, updateUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [updateFail, setUpdateFail] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const dispatch = useDispatch(); 

  useEffect(()=>{
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) =>{
    const storage = getStorage(app);
    let fileName, uploadedImage, newFile;
    
    if(file.type == 'image/heic'){
      const convertedBlob = await heic2any({ 
        blob: file,
        toType: 'image/jpeg', 
      });

      uploadedImage = new File([convertedBlob], `${file.name.split(".")[0]}.jpeg`,{
        type:'image/jpeg'
      });

      fileName = new Date().getTime() + uploadedImage.name;
      newFile = uploadedImage;
    } 
    else{
      fileName = new Date().getTime() + file.name;
      newFile = file;
    }
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, newFile);

    uploadTask.on('state_changed', (snapshot) =>{
      const progress =  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
    (error)=>{
      setFileUploadError(true);
    },

    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setFormData({...formData, avatar:downloadURL});
      });
    });
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        alert('Failed to update data');
        setUpdateFail(true);
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      alert('Congratulations! Your account has been successfully deleted.');
      dispatch(deleteUserSuccess(data));

    } catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try{
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signoutUserFailure(data.message));
        return;
      }
      alert('You have successfully signed out.');
      dispatch(signoutUserSuccess(data));

    } catch(error){
      dispatch(signoutUserFailure(error.message));
    }
  }

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
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" onChange={ (e) => setFile(e.target.files[0]) } ref={fileRef} hidden accept='image/*, .heic'/>

        <img src={formData.avatar || currentUser.avatar} alt="Profile Picture" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' onClick={() =>fileRef.current.click()} />
        <p className='text-center font-semibold'>
          {
            updateSuccess===true ? "":(fileUploadError ? (<span className='text-red-700'>Image Upload Error!</span>) : 
            filePerc > 0 && filePerc < 100 ? <span className='text-slate-700'>{`${filePerc}% Uploaded`}</span> : filePerc === 100 ? <span className='text-green-700'>Image uploaded successfully!</span> : "")
          }
        </p>
        <input type="text" id="username" placeholder='Username' defaultValue={currentUser.username} className='border p-3 rounded-lg' onChange={handleChange} />
        
        <input type="email" id="email" placeholder='Email' defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange} />
        
        <input type="password" id="password" placeholder='Password' className='border p-3 rounded-lg' onChange={handleChange} />
        
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:placeholder-opacity-80'>
          {loading ? 'Loading...' :  'Update'}
        </button>
        {/* <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
          Create Listing
        </Link> */}
      </form>
      <p className='text-red-700 mt-5 text-center'>
        {error ? error :''}
      </p>
      <p className='text-red-700 mt-5 text-center'>
        {updateFail ? 'Profile failed to update!' :''}
      </p>
      <p className='text-green-700 mt-5 text-center'>
        {updateSuccess ? 'Profile updated successfully!' :''}
      </p>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show My Listings Here</button>
      <Link to={"/my-listing"}>
        <button className='text-green-700 w-full'>Show My Listings</button>
      </Link>


      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings!' : ''}
      </p>
      {/* {
        userListings && userListings.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            All Listings
          </h1>
          {
            userListings.map((listing) =>(
              <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt='Listing Cover Image' className='h-20 w-20 object-contain rounded-lg'/>
                </Link>
                <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                  <p className=''>
                    {listing.name}
                  </p>
                </Link>
                <div className='flex flex-col item-center'>
                  <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-green-700 uppercase'>
                      Edit
                    </button>
                  </Link>
                </div>
              </div> 
            ))
          }
        </div>
      } */}
   </div>
  )
}
