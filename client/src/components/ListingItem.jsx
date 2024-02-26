import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import '../pages/style/ListingItem.css'
export default function ListingItem({ listing }) {
  return (
    <div className='listingItemContainer'>
      <Link to={`/listing/${listing._id}`} className='listingLink'>
        <img
          src={listing.imageUrls[0] || 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'}
          alt='listing cover'
          className='listingImage'
        />
        <div className='listingDetails'>
          <p className='listingName'>{listing.name}</p>
          
        </div>
      </Link>
    </div>
  );
}
