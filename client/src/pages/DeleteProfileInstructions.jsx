import React from 'react';

export default function DeleteProfileInstructions() {
    return(
        <>
            <div className='justify-center items-center flex flex-col mb-6 pb-20 mt-6'>
                <div className="bg-white justify-center items-center  shadow-md rounded-lg p-8">
                    <h1 className="text-xl font-bold mb-4">Instructions to Delete Profile</h1>
                    <h2 className="text-lg font-bold mb-1">
                        1. From RealEstate Mobile Application
                    </h2>
                    <p className="mb-1">In order to delete your profile from the RealEstate, please follow the steps given below:</p>
                    <p className="mb-6">
                        i. Open the RealEstate mobile application.
                        <br />
                        ii. If you have not logged in, please login.
                        <br />
                        iii. Go to "My Profile".
                        <br />
                        iv. Press "Delete" button and confirm your choices.
                    </p>
                    <h2 className="text-lg font-bold mb-1">
                        2. From RealEstate Website
                    </h2>
                    <p className="mb-1">In order to delete your profile from the RealEstate, please follow the steps given below:</p>
                    <p className="mb-6">
                        i. Open the RealEstate website: <a href='https://realestate-vgcw.onrender.com' className='underline cursor-pointer' target='_blank'>https://realestate-vgcw.onrender.com</a> .
                        <br />
                        ii. If you have not logged in, please login.
                        <br />
                        iii. Go to "Profile".
                        <br />
                        iv. Press "Delete Account" and confirm your choices.
                    </p>
                    <h1 className="text-xl font-bold mb-4">Types Of Data That Will Be Permanently Deleted:</h1>
                    <p className="mb-6">
                        i. Name, username, email id and password.
                        <br />
                        ii. Profile picture (if any).
                        <br />
                        iii. Your Listings (if any).
                    </p>
                    <h2 className="text-lg font-bold mb-2">PLEASE NOTE:</h2>
                    <h3 className="text-md font-semibold mb-4">We keep data as long as user has an account. Once the account is deleted, all associated data is deleted as well.</h3>
                </div>
            </div>
        </>
    );
}