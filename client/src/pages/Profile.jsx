import {useSelector, useDispatch} from 'react-redux'
import React, { useRef, useState, useEffect } from 'react';
import heic2any from 'heic2any';
import {getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject} from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, updateUserFailure, updateUserStart, updateUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess } from '../redux/user/userSlice';

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateFail, setUpdateFail] = useState(false);
  const [oldFirebaseProfilePic, setOldFirebaseProfilePic] = useState('');
  const [newFirebaseProfilePic, setNewFirebaseProfilePic] = useState('');
  const dispatch = useDispatch(); 

  useEffect(()=>{
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(()=>{
    if(currentUser.avatar.includes('firebase')){
      setOldFirebaseProfilePic(`${currentUser.avatar}`)
    }
  }, []);

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
      let tempName1, finalFileName;
      if(file.name.includes(" ")) {
        tempName1 = file.name.split(" ").join("");
        if(tempName1.includes("(") && tempName1.includes(")")){
          let tempName2, tempName3;
          if(tempName1.includes("(")){
              tempName2 = tempName1.split("(").join("");
          }
          if(tempName2.includes(")")){
              tempName3 = tempName2.split(")").join("");
          }
          finalFileName = tempName3;
        }
        else{
          finalFileName = tempName1;
        }
      } 
      else if(file.name.includes("(") && file.name.includes(")")){
        let tempName2, tempName3;
        if(file.name.includes("(")){
          tempName2 = file.name.split("(").join("");
        }
        if(tempName2.includes(")")){
          tempName3 = tempName2.split("(").join("");
        }
        finalFileName = tempName3;
      } 
      else {
        finalFileName = file.name;
      }

      fileName = new Date().getTime() + finalFileName;
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
        setNewFirebaseProfilePic(`${downloadURL}`);
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

      if(oldFirebaseProfilePic.includes('firebase') && newFirebaseProfilePic.includes('firebase')){
        const storage = getStorage();
        const desertRef = ref(storage, oldFirebaseProfilePic);
        deleteObject(desertRef).then(() => {
            console.log("Image Updated Successfully and Old Image Removed");
            setOldFirebaseProfilePic(`${newFirebaseProfilePic}`);
        }).catch((error) => {
            console.log("Failed To Remove Image With Error: ",error);
        });
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }

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
        setUserListings( 
            (prev) => prev.filter((listing) => listing._id !== listingID)
        );

    } catch (error) {
        console.log(error.message);
    }
  }

  const handleDeleteUser = async () => {
    try{
      dispatch(deleteUserStart());
      const listData = await fetch(`/api/user/listings/${currentUser._id}`);
      const listDataJson = await listData.json();
      for(let i=0; i< listDataJson.length; i++) {
        await handleListingDelete(listDataJson[i]._id)
      }
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      if(currentUser.avatar.includes('firebase')){
        const storage = getStorage();
        const desertRef = ref(storage, currentUser.avatar);
        deleteObject(desertRef).then(() => {
          console.log("Image Removed Successfully")
        }).catch((error) => {
          console.log("Failed To Remove Image");
            console.log(error)
        });
      }
      
      setIsOpen(false);
      alert('Goodbye! Your account has been successfully deleted.');
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

  return (
    <>
      <div className={`${isOpen === false ? "pb-32 p max-w-lg mx-auto" : "hidden fixed w-[100%] h-[100%] top-0 left-0 right-0 bottom-0 z-2 pb-10 cursor-pointer"}`}>
        <h1 className='text-3xl font-semibold text-center my-7'>
          Profile
        </h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type="file" onChange={ (e) => setFile(e.target.files[0]) } ref={fileRef} hidden accept='image/*, .heic'/>

          <img src={formData.avatar || currentUser.avatar} alt="Profile Picture" className='rounded-md h-24 w-24 object-cover cursor-pointer self-center mt-2' onClick={() =>fileRef.current.click()} />
          <p className='text-center font-semibold'>
            {
              updateSuccess===true ? "":(fileUploadError ? (<span className='text-red-700'>Image Upload Error!</span>) : 
              filePerc > 0 && filePerc < 100 ? <span className='text-slate-700'>{`${filePerc}% Uploaded`}</span> : filePerc === 100 ? <span className='text-green-700'>Image uploaded successfully! <br />Press 'Update' button to update the image.</span> : "")
            }
          </p>
          <input type="text" id="username" placeholder='Username' defaultValue={currentUser.username} className='border p-3 rounded-lg' onChange={handleChange} />
          
          <input type="text" id="fullname" placeholder='Full Name' defaultValue={currentUser.fullname} className='border p-3 rounded-lg' onChange={handleChange} />

          <input type="email" id="email" placeholder='Email' defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange} />
          
          <input type="password" id="password" placeholder='Password' className='border p-3 rounded-lg' onChange={handleChange} />
          
          <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:placeholder-opacity-80'>
            {loading ? 'Loading...' :  'Update'}
          </button>
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
          <span onClick={() => {setIsDeleting(true);setIsOpen(true);}} className='text-red-700 cursor-pointer'>
            Delete Account
          </span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
            Sign Out
          </span>
        </div>

      
    </div>
      <div>
        { isDeleting === true && (
              <div className={`fixed top-0 left-0 w-full h-full flex justify-center items-center ${isOpen ? 'block' : 'hidden'}`}>
                <div className="bg-white shadow-md rounded-lg p-8">
                  <h2 className="text-xl font-semibold mb-4">Delete Profile</h2>
                  <p className="mb-1">Are you sure you want to delete your profile?</p>
                  <p className="mb-6">All your listings (if any) will be deleted too.</p>
                  <div className="flex justify-end">
                    <button className="bg-red-500 text-white px-4 py-2 rounded mr-4" onClick={handleDeleteUser}>Delete</button>
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded" onClick={() => setIsOpen(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )
          }
      </div>
    </>
  )
}
