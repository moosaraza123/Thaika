import { MdLocationOn } from 'react-icons/md';
import { FaPhone } from 'react-icons/fa'; // Assuming this is the phone icon you want to use
import '../pages/style/ListingItem.css';
import { Link } from 'react-router-dom';


export default function ListingItem({ listing }) {
  return (
    <div className='listingItemContainer'>
      <div className='listingImageContainer'>
        <img
          src={listing.imageUrls[0] || 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'}
          alt='listing cover'
          className='listingImage'
        />
      </div>
      <div className='listingDetails'>
        <p className='listingName'>{listing.name}</p>
        <p className='listingDescription'>{listing.description}</p>
        <div className='locationContainer'>
          <MdLocationOn className='locationIcon' />
          <p className='listingLocation'>{listing.location}</p>
        </div>
        <p className='listingPrice'>{listing.price}</p>
        <button className='contactProviderButton'>
          <FaPhone className='phoneIcon' />
          Contact Provider
        </button>
      </div>
      <Link to={`/listing/${listing._id}`} className='listingLink'></Link>
    </div>
  );
}
