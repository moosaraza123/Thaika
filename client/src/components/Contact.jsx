import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/style/Contact.css'

function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setMessage(e.target.value);
      };
    useEffect(() => {
        const fetchLandlord = async () => {
          try {
            const res = await fetch(`/api/user/${listing.userRef}`);
            const data = await res.json();
            setLandlord(data);
          } catch (error) {
            console.log(error);
          }
        };
        fetchLandlord();
      }, [listing.userRef]);
  return<>
  {landlord && (
    <div className='flex flex-col gap-2'>
      <p className='contact-info'>
        Contact <span className='font-semibold'>{landlord.username}</span>{' '}
        for{' '}
        <span className='font-semibold'>{listing.name.toLowerCase()}</span>
      </p>
      <div className="message-container">
        <textarea
          name='message'
          id='message'
          rows='2'
          value={message}
          onChange={onChange}
          placeholder='Enter your message here...'
          className='message-box'
        ></textarea>

        <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='send-message-button'
        >
          Send Message          
        </Link>
      </div>
    </div>
  )}
</>


}

export default Contact