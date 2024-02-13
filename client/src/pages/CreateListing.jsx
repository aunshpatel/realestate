import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import { ref, getDownloadURL, getStorage, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { app } from '../firebase';
import heic2any from 'heic2any';
import { useNavigate } from 'react-router-dom';


export default function CreateListing() {
    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user);
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Furnished'); 
    const [formData, setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        discount:false,
        parking:0,
        furnished:'Furnished',
    });
    const [error, setError] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [loading, setLoading] = useState(false);

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
        return new Promise(async (resolve, reject) => {
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

    const handleChange = (e) =>{
        if(e.target.id === 'sell' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        
        if(e.target.id === 'discount'){
            setFormData({
                ...formData,
                discount: e.target.checked
            })
        }
        if(e.target.value === 'Furnished' || e.target.value === 'Semi-Furnished' || e.target.value === 'Unfurnished'){
            setFormData({
                ...formData,
                furnished: e.target.value
            })
            setSelectedValue(e.target.value)
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            if(e.target.type === 'number'){
                setFormData({
                    ...formData,
                    [e.target.id]: e.target.valueAsNumber
                })
            } else{
                setFormData({
                    ...formData,
                    [e.target.id]: e.target.value
                })
            }
        }

        // if(e.target.id === 'parking' || e.target.id === 'bedrooms' || e.target.id === 'bathrooms'){
        //     setFormData({
        //         ...formData,
        //         [e.target.id]: e.target.value
        //     })
        // }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(formData.imageUrls.length < 1) return setError('You must upload at least 1 image!')
        if(formData.regularPrice < formData.discountPrice) return setError("'Discounted Price' must be less than the 'Regular Price'")
        if(formData.regularPrice === formData.discountPrice) return setError("'Discounted Price' can not be equal to the 'Regular Price'")
        try {
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message)
            }
            alert('Listing Created Successfully. You will now be redirected to its page.');
            navigate(`/listing/${data._id}`);

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create A Listing</h1>

            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
                <div className='flex flex-col gap-4 flex-1'>
                    <div className='flex flex-col gap-4 flex-1'>
                        <input type='text' id='name' placeholder='Name' onChange={handleChange} value={formData.name} className='border p-3 rounded-lg' maxLength={62} minLength={3} required />
                        
                        <textarea type='text' id='description' onChange={handleChange} value={formData.description} placeholder='Description' className='border p-3 rounded-lg' required />

                        <input type='text' id='address' placeholder='Address' onChange={handleChange} value={formData.address} className='border p-3 rounded-lg' required />
                    </div>

                    <div className='flex gap-6 flex-wrap my-7'>
                        <div className='flex gap-2'> 
                            <input type='checkbox' id='sell' onChange={handleChange} checked={formData.type === 'sell'} className='w-5'/>
                            <span className='flex items-center'>Sell</span> 
                        </div>

                        <div className='flex gap-2'> 
                            <input type='checkbox' id='rent' onChange={handleChange} checked={formData.type === 'rent'} className='w-5' />
                            <span className='flex items-center'>Rent</span> 
                        </div>

                        <div className='flex gap-2'> 
                            <input type='checkbox' id='discount' className='w-5' onChange={handleChange} checked={formData.discount} /> 
                            <span className='flex items-center'>Discount</span>
                        </div>

                        <div className='flex items-center gap-2'>
                            <input type='number' id='regularPrice' min='50' max="1000000000" step='0.01' onChange={handleChange} value={formData.regularPrice} className='p-2 border border-gray-300 rounded-lg'/>
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                {/* <span className='text-xs'>(Monthly)</span> */}
                                {
                                    formData.type === 'rent' && 
                                    (
                                        <span className='text-xs'>(Monthly)</span>
                                    )
                                }
                            </div>
                        </div>
                        {
                            formData.discount &&
                            (
                                <div className='flex items-center gap-2'>
                                    <input type='number' id='discountPrice' min='0' max="1000000000" step='0.01' onChange={handleChange} value={formData.discountPrice} className='p-2 border border-gray-300 rounded-lg'/>
                                    <div>
                                        <div className='flex flex-col items-center'>
                                            <p>Discounted Price</p>
                                            {/* <span className='text-xs'>(Monthly)</span> */}
                                            {
                                                formData.type === 'rent' && 
                                                (
                                                    <span className='text-xs'>(Monthly)</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bedrooms' min='1' max='100' onChange={handleChange} value={formData.bedrooms} className='p-2 border border-gray-300 rounded-lg' required />
                            <p>Bedrooms</p>
                        </div>

                        <div className='flex items-center gap-2'>
                            <input type='number' id='bathrooms' min='1' max='100' step='0.5' onChange={handleChange} value={formData.bathrooms} className='p-2 border border-gray-300 rounded-lg' required />
                            <p>Bathrooms</p>
                        </div>

                        <div className='flex gap-2'>
                            <input type='number' id='parking' min='0' max='999' onChange={handleChange} value={formData.parking} className='p-2 border border-gray-300 rounded-lg' required />
                            <span className='flex items-center'>Parking Spot(s)</span>
                        </div>
                    </div>
                    <div className='flex gap-2'> 
                        <select value={selectedValue} name="furnished" onChange={handleChange} id="furnished" className='w-26 border p-3 rounded-lg'>
                            <option value="Furnished">Furnished</option>
                            <option value="Semi-Furnished">Semi Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                        </select>
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
                    {/* uploading stands for image uploading */}
                    <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Creating...':'Create Listing'}
                    </button>
                    { error && <p className='text-red-700 text-sm'>{error}</p> }
                </div>
            </form>
        </main>
    )
}
