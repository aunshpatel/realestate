import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import googlePlay from "../assets/images/coming-soon-to-googleplay.jpeg";
import appStore from "../assets/images/coming-soon-to-apple.jpeg";

export default function Footer() {
    return(
        <>
            <div className='flex xs:flex-col sm:flex-row justify-between bg-slate-200 sm:h-[76px] w-[100%] fixed bottom-0 z-10'>
                <div className="flex xs:flex-col sm:flex-row items-center xs:p-6 sm:p-4">
                    <ul className='flex xs:flex-col sm:flex-row xs:space-y-8 sm:space-x-8'>
                        <Link to='/mobileapp-privacy-policy' className="border-b border-gray-400 uppercase">
                            <li className='text-md'>Mobile App Privacy Policy</li>
                        </Link>

                        <Link to='/delete-profile-instructions' className="border-b border-gray-400 uppercase">
                            <li className='text-md'>Delete Profile Instructions</li>
                        </Link>

                        <Link to='/contact-us' className="border-b border-gray-400 uppercase">
                            <li className='text-md'>Contact Us</li>
                        </Link>
                    </ul>
                </div>
                <div className="flex xs:flex-col sm:flex-row items-center xs:p-6 sm:p-4">
                    <ul className='flex xs:flex-col sm:flex-row xs:space-y-8 sm:space-x-8'>
                        <Link to='/mobileapp-privacy-policy' className="border-b border-gray-400 uppercase">
                            <li className='text-md'>
                                <img src={googlePlay} alt="Coming Soon to Google Play" className='h-[50px]'/>
                            </li>
                        </Link>

                        <Link to='/delete-profile-instructions' className="border-b border-gray-400 uppercase">
                            <img src={appStore} alt="Coming Soon to App Store" className='h-[50px]'/>
                        </Link>
                    </ul>
                </div>
            </div>
        </>
    );
}