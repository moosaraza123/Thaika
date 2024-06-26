import React from 'react'
import { useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import './style/Listing.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSelector } from 'react-redux';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import Contact from '../components/Contact';
function Listing() {
    SwiperCore.use([Navigation])
    const params = useParams();
    const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
          try {
            setLoading(true);
            const res = await fetch(`/api/listing/get/${params.listingId}`);
            const data = await res.json();
            if (data.success === false) {
              setError(true);
              setLoading(false);
              return;
            }
            setListing(data);
            setLoading(false);
            setError(false);
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        };
        fetchListing();
      }, [params.listingId]);
  return <>
   <main>
 {loading && <p className='loading-text'>Loading...</p>}
 {error && (
        <p className='something-went-wrong'>Something went wrong!</p>

      )}
{listing && !loading && !error &&  (

<div>

<Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='image-container'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'contain',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div>
  <h2 className="service-heading">Name of Service : <span className="service-name">{listing.name}</span></h2>
</div>


          <h2 id="servicePrice">Service Price : {listing.minPrice} - {listing.maxPrice} pkr</h2>
          <h3 id="descriptionHeading">Description</h3>
          <p id="serviceDescription">{listing.description}</p>
          <p id="Experience"><strong>Experience (year) :</strong> {listing.experience} </p>


          {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='custom-button'
              >
                Contact Service Provider 
              </button>
                )}
                     {contact && <Contact listing={listing} />}
</div>


) }



   </main>
   </>
  
}

export default Listing