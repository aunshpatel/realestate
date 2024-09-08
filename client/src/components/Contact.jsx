import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';

export default function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    
    const onChange = (e) => {
        setMessage(e.target.value);
    }

    useEffect(() =>{
        const fetchLandlord = async () =>{
            try {
                const res = await fetch(`/api/user/profile/${listing.userRef}`);
                const data = await res.json();
                console.log(data);
                
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    }, [listing.userRef]);

    return (
        <>
        {
            landlord && (
                <div className=''>
                    <p>
                    Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{"'" + listing.name + "'"}</span>
                    </p>
                    <div className='flex flex-col gap-2'>
                        <textarea name="message" id="message" placeholder="Enter your message here" value={message} onChange={onChange} rows="2" className='w-full border p-3 rounded-lg'></textarea>

                        <Link to={`mailto:${landlord.email}?subject=Inquiry regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
                            Send Message
                        </Link>
                    </div>
                </div>
            )
        }
        </>
    )
}
