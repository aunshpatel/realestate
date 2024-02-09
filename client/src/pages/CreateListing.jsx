import React, { useState } from 'react';
import { ref, getDownloadURL, getStorage, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { app } from '../firebase';


export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls:[],
    });
    console.log(formData)

    const handleImageSubmit = (e)=>{
        if(files.length > 0 && (files.length+formData.imageUrls.length) < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for(let i=0; i < files.length; i++){
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) =>{
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err)=>{
                setImageUploadError('Image Upload Failed!');
                setUploading(false);
            });
        } else if(files.length === 0){
            setImageUploadError('You have not selected any image! Please select at least 1 image!');
            setUploading(false);
        }else {
            setImageUploadError('You can upload only upload a maximum of 6 images per listing!');
            setUploading(false);
        }

    }

    const storeImage = async (file) =>{
        return new Promise((resolve, reject) =>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) =>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) =>{
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) =>{
                            resolve(downloadURL)
                        }
                    );
                }
            );
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });

        //Below code removes image from the firebase db
        const storage = getStorage();
        const name = formData.imageUrls.at(index);
        const desertRef = ref(storage, name);
        deleteObject(desertRef).then(() => {
            alert("Image Removed Successfully")
        }).catch((error) => {
            alert("Failed To Remove Image");
            console.log(error)
        });
    }

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
                        <input type="file" id='images' accept='image/*, .heic' onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' multiple />
                        <button type='button' onClick={handleImageSubmit} disabled={uploading} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) =>(
                            <div key={url} className='flex justify-between p-3 border items-center'>
                                <img src={url} alt="Listing Image" className='w-20 h-20 object-contain rounded-lg'/>
                                <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    }
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 hover:placeholder-opacity-80'>
                        Create Listing
                    </button>
                </div>
            </form>
        </main>
    )
}
