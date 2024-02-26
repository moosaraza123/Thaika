import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import './style/home.css'
import { GiBulldozer } from "react-icons/gi";
function Home() {
  const [offerListings, setOfferListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=4');
        const data = await res.json();
        setOfferListings(data);
       
      } catch (error) {
        console.log(error);
      }
    };
  

 
    fetchOfferListings();
  }, []);



return <>
<div className="herocontainer">
<h1> Discover Your Perfect Building Experience with Ease ! </h1>


<button >let’s start now..</button>

<GiBulldozer id='shovel'/>



</div>
<Swiper navigation>
  {offerListings &&
    offerListings.length > 0 &&
    offerListings.map((listing) => (
      <SwiperSlide key={listing._id}>
        <div
          className='custom-swiper-slide'
          style={{
            background: `url(${listing.imageUrls[0]}) center no-repeat`,
            backgroundSize: 'cover',
          }}
        ></div>
      </SwiperSlide>
    ))}
</Swiper>
<div className='max-container'>
  {offerListings && offerListings.length > 0 && (
    <div className='offer-container'>
      <div className='header'>
        <h2 className='title'>New Services</h2>
        <Link className='show-more-link' to={'/search'}>Show more offers</Link>
      </div>
      <div className='listing-container'>
        {offerListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}
</div>


</>


}

export default Home